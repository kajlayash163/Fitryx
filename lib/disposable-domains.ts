// Comprehensive list of disposable/temporary email domains
// Source: https://github.com/disposable-email-domains/disposable-email-domains
const DISPOSABLE_DOMAINS = new Set([
  // Top disposable providers
  'mailinator.com', 'guerrillamail.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
  'guerrillamail.org', 'tempmail.com', 'temp-mail.org', 'temp-mail.io',
  'throwaway.email', 'throwaway.com', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamailblock.com', 'spam4.me', 'grr.la', 'dispostable.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf',
  'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
  'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
  'tempail.com', 'tempr.email', 'tempmailaddress.com',
  'mailnesia.com', 'maildrop.cc', 'discard.email', 'discardmail.com',
  'discardmail.de', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.org', 'trashmail.at', 'trashmail.io', 'trashmail.ws',
  'trash-mail.com', 'trash-mail.at', 'trash-mail.de',
  'mailcatch.com', 'mailscrap.com', 'mailexpire.com',
  'tempinbox.com', 'tempomail.fr', 'temporarymail.com',
  '10minutemail.com', '10minutemail.co.za', '10minutemail.net',
  '10minutemail.be', '10minutemail.us', '10minutemail.pl',
  '20minutemail.com', '20minutemail.it', '20mail.it', '20email.eu',
  'minutemail.io', 'emailondeck.com',
  'getnada.com', 'nada.email', 'nada.ltd',
  'harakirimail.com', 'mailforspam.com', 'safetymail.info',
  'filzmail.com', 'inboxalias.com', 'jetable.org', 'incognitomail.org',
  'incognitomail.com', 'mailcatch.com', 'binkmail.com',
  'spamdecoy.net', 'spamfree24.org', 'spamgourmet.com',
  'spamhereplease.com', 'spamhole.com', 'spamify.com',
  'spaminator.de', 'spamkill.info', 'spaml.com', 'spaml.de',
  'spammotel.com', 'spamoff.de', 'spamslicer.com', 'spamspot.com',
  'spamstack.net', 'spamtrail.com', 'spamtroll.net',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
  'wh4f.org', 'whyspam.me', 'willhackforfood.biz', 'willselfdestruct.com',
  'winemaven.info', 'wronghead.com', 'wuzup.net', 'wuzupmail.net',
  'wwwnew.eu', 'xagloo.com', 'xemaps.com', 'xents.com',
  'xjoi.com', 'xoxy.net', 'xyzfree.net',
  'zetmail.com', 'zippymail.info', 'zoaxe.com', 'zoemail.org',
  'privy-mail.com', 'proxymail.eu', 'punkass.com', 'putthisinyouremail.com',
  'qq.com', 'quickinbox.com', 'rcpt.at', 'reallymymail.com',
  'recode.me', 'reconmail.com', 'regbypass.com', 'rejectmail.com',
  'rhyta.com', 'rklips.com', 'rmqkr.net', 'royal.net',
  'rppkn.com', 'rtrtr.com', 'ruffrey.com', 'rxprice.info',
  'safersignup.de', 'safetypost.de', 'sandelf.de', 'saynotospams.com',
  'scatmail.com', 'schafmail.de', 'selfdestructingmail.com',
  'sendspamhere.com', 'sharklasers.com', 'shieldedmail.com',
  'shiftmail.com', 'shortmail.net', 'sibmail.com', 'skeefmail.com',
  'slaskpost.se', 'slipry.net', 'slopsbox.com', 'slowslow.de',
  'smashmail.de', 'smellfear.com', 'snakemail.com', 'sneakemail.com',
  'snkmail.com', 'sofimail.com', 'sogetthis.com', 'soodonims.com',
  'spamavert.com', 'spambob.com', 'spambob.net', 'spambob.org',
  'spambog.com', 'spambog.de', 'spambog.ru',
  'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu',
  'gustr.com', 'jourrapide.com', 'superrito.com', 'teleworm.us',
  'armyspy.com', 'despammed.com',
  'mytemp.email', 'mohmal.com', 'emailfake.com', 'crazymailing.com',
  'tempmailo.com', 'tempm.com', 'tempsky.com',
  'burnermail.io', 'inboxbear.com', 'mailsac.com',
  'anonbox.net', 'mintemail.com', 'meltmail.com',
  'dropmail.me', 'instantemailaddress.com', 'tmail.com',
  'moakt.com', 'moakt.ws', 'moakt.co',
  'generator.email', 'email-fake.com', 'tempmailer.com',
  'emkei.cz', 'bugmenot.com', 'maildax.com',
  'mailtemp.info', 'mail-temp.com', 'tmpmail.net', 'tmpmail.org',
  'tmails.net', 'emailtemporario.com.br',
  'smailpro.com', 'emailnax.com', 'fakemail.net',
  'internetchillz.com', 'onewaymail.com',
])

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return true // No domain = invalid
  return DISPOSABLE_DOMAINS.has(domain)
}

export function isValidEmailFormat(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}
