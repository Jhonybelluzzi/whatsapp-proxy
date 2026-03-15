export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.redirect(301, 'https://www.playerverificado.com.br');
  }

  const nomeLimpo = decodeURIComponent(user);
  const userSafe = encodeURIComponent(nomeLimpo);

  try {
    const SUPABASE_URL = 'https://fnophsqudrkeyjdnheig.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub3Boc3F1ZHJrZXlqZG5oZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ1ODIsImV4cCI6MjA4NTYzMDU4Mn0.OnDUMBvWsnUq0ifvFgpz6BD2Xq1HHjmWk6FYy74GdF4';

    // Removemos as aspas e usamos 'ilike' para ignorar maiúsculas/minúsculas
    const filtroQuery = encodeURIComponent(`(nick_roblox.ilike.${nomeLimpo},username.ilike.${nomeLimpo})`);
    const urlBusca = `${SUPABASE_URL}/rest/v1/profiles?or=${filtroQuery}&select=username,avatar`;

    const response = await fetch(urlBusca, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    
    // Verifica se os dados vieram corretamente em formato de lista (array)
    const perfil = Array.isArray(data) && data.length > 0 ? data[0] : null;

    const nomeExibicao = perfil && perfil.username ? perfil.username : nomeLimpo;
    
    const fotoFallback = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nomeExibicao) + '&background=000&color=fff&size=512';
    const fotoExibicao = perfil && perfil.avatar ? perfil.avatar : fotoFallback;

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          
          <meta property="og:image" content="${fotoExibicao}">
          <meta property="og:image:secure_url" content="${fotoExibicao}">
          <meta property="og:image:type" content="image/png">
          <meta property="og:image:width" content="400">
          <meta property="og:image:height" content="400">
          
          <title>Loja de ${nomeExibicao} - Player Verificado</title>
          <meta property="og:title" content="Loja de ${nomeExibicao} no Player Verificado">
          <meta property="og:description" content="Aceda à loja de ${nomeExibicao} e confira os itens disponíveis!">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:image" content="${fotoExibicao}">

          <meta http-equiv="refresh" content="0; url=https://www.playerverificado.com.br/loja/${userSafe}">
          <script>
              window.location.href = "https://www.playerverificado.com.br/loja/${userSafe}";
          </script>
      </head>
      <body>
          <p>A redirecionar para a loja...</p>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (error) {
    res.redirect(301, `https://www.playerverificado.com.br/loja/${userSafe}`);
  }
}
