export enum ModalAction {
  Providers = 'providers',
  Logs = 'logs',
  Accounts = 'accounts',
}

function pushAction(ctx: any, action: ModalAction) {
  ctx.$modal.push(action)
}

