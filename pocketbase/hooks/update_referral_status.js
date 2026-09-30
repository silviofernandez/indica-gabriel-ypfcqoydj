routerAdd(
  'POST',
  '/backend/v1/update-referral-status',
  (e) => {
    // 1. Validação de autenticação
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { error: 'Não autorizado. Faça login para continuar.' })
    }

    // 2. Determinar papel (role) do usuário autenticado (manager, master, operator)
    let userRole = ''
    let userTeamId = ''
    try {
      const userProfile = $app.findFirstRecordByData('profiles', 'user_id', authRecord.id)
      if (userProfile) {
        userRole = String(userProfile.get('role') || '').trim()
        userTeamId = String(userProfile.get('team_id') || '').trim()
      }
    } catch (_) {}

    if (!userRole && authRecord.email === 'gabsilvio@gmail.com') {
      userRole = 'master'
    }

    // Apenas manager, master (e operator para flexibilidade operacional) podem atualizar status
    if (userRole !== 'master' && userRole !== 'manager' && userRole !== 'operator') {
      return e.json(403, {
        error: 'Apenas gestores ou administradores podem alterar o status das indicações.',
      })
    }

    // 3. Obter payload
    const body = e.requestInfo().body || {}
    const referralId = String(body.referral_id || body.id || '').trim()
    const newStatus = String(body.status || body.new_status || '')
      .trim()
      .toLowerCase()
    const notes = String(body.notes || body.observacoes || '').trim()

    if (!referralId) {
      return e.json(400, { error: 'Identificador da indicação (referral_id) é obrigatório.' })
    }

    if (!newStatus) {
      return e.json(400, { error: 'Novo status é obrigatório.' })
    }

    // 4. Validar status permitido
    const allowedStatuses = [
      'sent',
      'in_analysis',
      'in_progress',
      'visited',
      'negotiating',
      'closed_won',
      'closed_lost',
      'paid',
      'cancelled',
      'expired',
    ]

    if (!allowedStatuses.includes(newStatus)) {
      return e.json(400, {
        error: 'Status inválido. Use um dos status permitidos: ' + allowedStatuses.join(', '),
      })
    }

    // 5. Buscar a indicação
    let referralRecord = null
    try {
      referralRecord = $app.findFirstRecordByData('referrals', 'id', referralId)
    } catch (err) {
      return e.json(404, { error: 'Indicação não encontrada.' })
    }

    // 6. Verificar se o gestor tem permissão sobre esta indicação:
    // - Master e Operator têm acesso amplo
    // - Manager só pode alterar se a indicação estiver atribuída diretamente a ele
    //   OU se estiver atribuída à sua equipe
    if (userRole === 'manager') {
      const assignedManager = String(
        referralRecord.get('assigned_manager_id') || referralRecord.get('assigned_to') || '',
      )
      const assignedTeam = String(referralRecord.get('assigned_team_id') || '')

      const isDirectlyAssigned = assignedManager === authRecord.id
      const isTeamAssigned = userTeamId && assignedTeam && assignedTeam === userTeamId

      if (!isDirectlyAssigned && !isTeamAssigned) {
        return e.json(403, {
          error:
            'Acesso negado. Você só pode gerenciar indicações atribuídas diretamente a você ou à sua equipe.',
        })
      }
    }

    const oldStatus = String(referralRecord.get('status') || 'sent')

    // 7. Atualizar a indicação
    try {
      referralRecord.set('status', newStatus)
      if (notes) {
        // Se houver notas, acrescenta ou atualiza o campo notes da indicação
        const currentNotes = String(referralRecord.get('notes') || '').trim()
        const updatedNotes = currentNotes ? currentNotes + '\n' + notes : notes
        referralRecord.set('notes', updatedNotes)
      }
      $app.save(referralRecord)
    } catch (saveErr) {
      console.log('Erro ao atualizar status da indicação:', saveErr)
      return e.json(500, {
        error: 'Erro ao atualizar status: ' + (saveErr.message || String(saveErr)),
      })
    }

    // 8. Gravar registro no histórico de status (referral_status_history)
    let historyRecord = null
    try {
      const historyCol = $app.findCollectionByNameOrId('referral_status_history')
      historyRecord = new Record(historyCol)
      historyRecord.set('referral_id', referralRecord.id)
      historyRecord.set('old_status', oldStatus)
      historyRecord.set('new_status', newStatus)
      historyRecord.set('changed_by', authRecord.id)
      historyRecord.set('notes', notes || 'Atualização de status')
      $app.save(historyRecord)
    } catch (hErr) {
      console.log('Aviso ao registrar histórico de status:', hErr)
    }

    return e.json(200, {
      success: true,
      message: 'Status atualizado com sucesso!',
      referral_id: referralRecord.id,
      old_status: oldStatus,
      new_status: newStatus,
      notes: notes,
      history_id: historyRecord ? historyRecord.id : null,
    })
  },
  $apis.requireAuth(),
)
