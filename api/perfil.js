export default async function handler(req, res) {
  // 1. Pega o nome do usuário da URL (ex: ?user=jhony)
  const { user } = req.query;

  // Se não tiver usuário, manda pro site principal
  if (!user) {
    return res.redirect(301, 'https://playerverificado.com.br');
  }

  try {
    // 2. Busca os dados no seu Supabase (Usando a API REST direto para ser rápido)
    // Substitua pela sua URL e sua ANON KEY pública do Supabase
    const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
    const SUPABASE_KEY = 'SUA_ANON_KEY';

    // Fazendo a busca na tabela onde ficam os perfis (exemplo: 'profiles')
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?username=eq.${user}&select=nome,foto_url`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await response.json();
    const perfil = data[0]; // Pega o primeiro resultado

    // Se o usuário não existir, usa uma imagem padrão ou redireciona
    const nomeExibicao = perfil ? perfil.nome : 'Player Verificado';
    const fotoExibicao = perfil ? perfil.foto_url : 'https://playerverificado.com.br/logo-padrao.png';

    // 3. Monta o HTML com as tags pro WhatsApp e o redirecionamento pro usuário real
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <title>Perfil de ${nomeExibicao} - Player Verificado</title>
          
          <meta property="og:title" content="${nomeExibicao} está no Player Verificado!">
          <meta property="og:description" content="Confira o perfil e a loja de ${nomeExibicao}.">
          <meta property="og:image" content="${fotoExibicao}">
          <meta property="og:type" content="website">
          <meta name="twitter:card" content="summary_large_image">

          <meta http-equiv="refresh" content="0; url=https://playerverificado.com.br/${user}">
          <script>
              // Redirecionamento via JavaScript como backup
              window.location.href = "https://playerverificado.com.br/${user}";
          </script>
      </head>
      <body>
          <p>Redirecionando para o perfil de ${nomeExibicao}...</p>
      </body>
      </html>
    `;

    // 4. Entrega o HTML para quem acessou (robô ou humano)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (error) {
    // Em caso de erro, manda pro site principal pra não deixar o usuário na mão
    res.redirect(301, `https://playerverificado.com.br/${user}`);
  }
}
