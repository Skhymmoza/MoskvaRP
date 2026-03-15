// api/admins-list.js
// Список администраторов - показывается в игре

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    admins: [
      { nick: "Admin", level: 6, online: false },
      { nick: "Moderator", level: 3, online: false }
    ]
  });
}
