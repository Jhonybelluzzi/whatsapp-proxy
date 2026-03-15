export default async function handler(req, res) {
  // Pega o nome do usuário da URL
  const { user } = req.query;

  // Se não tiver usuário no link, manda pra página inicial
  if (!user) {
    return res.redirect(301, 'https://playerverificado.com.br');
  }

  try {
    // Seus dados reais do Supabase fornecidos pelo Lovable
    const SUPABASE_URL = 'https://fnophsqudrkeyjdnheig.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZub3Boc3F1ZHJrZXlqZG5oZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTQ1ODIsImV4cCI6MjA4NTYzMDU4Mn0.OnDUMBvWsnUq0ifvFgpz6BD2Xq1HHjmWk6FYy74GdF4';

    // Fazendo a busca na tabela 'profiles' pelas colunas corretas
    // Ele vai procurar o usuário tanto na coluna nick_roblox quanto na username
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?or=(nick_roblox.eq.${user},username.eq.${user})&select=username,avatar`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    const perfil = data && data.length > 0 ? data[0] : null;

    // Se achar o usuário, pega os dados. Se não achar, usa um texto/imagem padrão
    const nomeExibicao = perfil && perfil.username ? perfil.username : 'Player Verificado';
    const fotoExibicao = perfil && perfil.avatar ? perfil.avatar : 'https://playerverificado.com.br/logo-padrao.png';

    // Monta o HTML com as tags pro WhatsApp e o redirecionamento pro usuário real
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

          <meta http-equiv="refresh" content="0; url=https://playerverificado.com.br/loja/${user}">
          <script>
              window.location.href = "https://playerverificado.com.br/loja/${user}";
          </script>
      </head>
      <body>
          <p>Redirecionando para a loja de ${nomeExibicao}...</p>
      </body>
      </html>
    `;

    // Entrega o código final
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (error) {
    // Se der qualquer erro na comunicação com o banco, garante que o cliente não fique travado
    res.redirect(301, `https://playerverificado.com.br/loja/${user}`);
  }
}
