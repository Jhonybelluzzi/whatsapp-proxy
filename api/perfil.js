export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.redirect(301, 'https://www.playerverificado.com');
  }

  const userSafe = encodeURIComponent(user);

  try {
    const SUPABASE_URL = 'https://fnophsqudrkeyjdnheig.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub3Boc3F1ZHJrZXlqZG5oZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ1ODIsImV4cCI6MjA4NTYzMDU4Mn0.OnDUMBvWsnUq0ifvFgpz6BD2Xq1HHjmWk6FYy74GdF4';

    const filtroQuery = encodeURIComponent(`(nick_roblox.eq.${user},username.eq.${user})`);
    const urlBusca = `${SUPABASE_URL}/rest/v1/profiles?or=${filtroQuery}&select=username,avatar`;

    const response = await fetch(urlBusca, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    const perfil = data && data.length > 0 ? data[0] : null;

    const nomeExibicao = perfil && perfil.username ? perfil.username : user;
    const fotoExibicao = perfil && perfil.avatar ? perfil.avatar : 'https://www.playerverificado.com/logo-padrao.png';

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Loja de ${nomeExibicao} - Player Verificado</title>
          
          <meta property="og:title" content="Loja de ${nomeExibicao} no Player Verificado">
          <meta property="og:description" content="Acesse a loja de ${nomeExibicao} e confira os itens disponíveis!">
          <meta property="og:image" content="${fotoExibicao}">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">

          <meta http-equiv="refresh" content="0; url=https://www.playerverificado.com/loja/${userSafe}">
          <script>
              window.location.href = "https://www.playerverificado.com/loja/${userSafe}";
          </script>
      </head>
      <body>
          <p>Redirecionando para a loja...</p>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (error) {
    res.redirect(301, `https://www.playerverificado.com/loja/${userSafe}`);
  }
}
