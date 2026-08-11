export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length <= 2 ? user[0] : `${user.slice(0, 2)}***${user.slice(-1)}`;
  return `${visible}@${domain}`;
}
