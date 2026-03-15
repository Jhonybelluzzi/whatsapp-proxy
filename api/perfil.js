export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.redirect(301, 'https://www.playerverificado.com.br');
  }

  // Descodifica o nome (ex: "Jhony%20Belluzzi" volta a ser "Jhony Belluzzi")
  const nomeLimpo = decodeURIComponent(user);
  const userSafe = encodeURIComponent(nomeLimpo);

  try {
    const SUPABASE_URL = 'https://fnophsqudrkeyjdnheig.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub3Boc3F1ZHJrZXlqZG5oZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ1ODIsImV4cCI6MjA4NTYzMDU4Mn0.OnDUMBvWsnUq0ifvFgpz6BD2Xq1HHjmWk6FYy74GdF4';

    // O URL exato fornecido pelo Lovable para a RPC
    const urlBusca = `${SUPABASE_URL}/rest/v1/rpc/get_public_profile`;

    // Fazemos um POST enviando o parâmetro p_nick como eles pediram
    const response = await fetch(urlBusca, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ p_nick: nomeLimpo })
    });

    const data = await response.json();
    
    // O Lovable confirmou que a resposta é um Array JSON
    const perfil = Array.isArray(data) && data.length > 0 ? data[0] : null;

    const nomeExibicao = perfil && perfil.username ? perfil.username : nomeLimpo;
    
    // Se por acaso o utilizador não tiver foto (nem do Roblox), usamos a imagem de fallback
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
          <meta property="og:description" content="Acesse a loja de ${nomeExibicao} e confira os itens disponíveis!">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:image" content="${fotoExibicao}">

          <meta http-equiv="refresh" content="0; url=https://www.playerverificado.com.br/loja/${userSafe}">
          <script>
              window.location.href = "https://www.playerverificado.com.br/loja/${userSafe}";
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
    res.redirect(301, `https://www.playerverificado.com.br/loja/${userSafe}`);
  }
}
