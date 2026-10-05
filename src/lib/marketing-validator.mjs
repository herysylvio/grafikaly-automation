export function prepareSafeCampaignPayload(input) {
  if (!input.name?.trim() || !input.subject?.trim() || !input.htmlContent?.trim()) {
    throw new Error('Une campagne nécessite name, subject et htmlContent');
  }
  return {
    ...input,
    status: 'draft',
  };
}

export function prepareAutomationRunPayload({ ruleId, allowLive = false }) {
  if (!ruleId) throw new Error('ruleId requis');
  return {
    ruleId,
    dryRun: !allowLive,
  };
}
