---
{"dg-publish":true,"permalink":"/ocarina-of-time-server-in-android-2025/","dg-note-properties":{}}
---

# ⚔️ Como Hospedar um Servidor de Ocarina of Time/Ship of Harkinian no Android

> [!tip] Aconselhável possuir conexão estável para baixar e instalar programas necessários, além de manter os serviços ativos, e conectar um teclado físico (via Bluetooth ou cabo OTG). Também é possível usar o app **Hacker's Keyboard** ou configurar e conectar via SSH.

>[!question] **Diferentemente do servidor de Minecraft, não é necessário um celular muito potente**, pois a quantidade necessária de memória RAM é aproximadamente entre **256 e 512 MB**.

## Etapa 1 — Repita o Mesmo Procedimento do Servidor Anterior

1. Baixe **Termux** e **AnLinux** no seu Android na Google Play Store.
2. Selecione **Ubuntu** no AnLinux e copie o código.
3. Execute o comando no Termux.
4. Para iniciar o servidor, execute:
    
    ```bash
    ./start-ubuntu.sh
    ```
    
    - Você pode renomear para `s`, executando:
        
        ```bash
        mv start-ubuntu.sh s
        ```
        
        Isso permite entrar no Ubuntu escrevendo apenas `./s`.

> **IMPORTANTE:** Arraste para baixo na barra de notificações — deve haver uma opção de **Wakelock** para o Termux. Isso impede que o serviço seja encerrado e permite que continue funcionando em segundo plano.

## Etapa 2 — Instalação dos Componentes Necessários

Antes de instalar os componentes necessários, execute:

```bash
apt-get update && apt-get upgrade
apt install nano   # Programa de edição e adição de arquivos
apt install curl   # Usado para instalação do Ngrok, serve para obter URLs
```

>[!question] Por algum motivo, o Ubuntu instalado não possui esses dois comandos instalados por padrão.

Instale também o Git e o Deno:

```bash
apt install git   # Utilizado para clonar o repositório contendo o projeto do servidor
curl -fsSL https://deno.land/install.sh | sh -s v1.46.3   # Aplicação responsável pela execução do servidor e das sessões
```

> **Instalação:** Você pode selecionar uma outra versão do Deno, contanto que seja **anterior a 2.0.0**.

Certifique-se da instalação com:

```bash
deno -version
```

## Etapa 3 — Configurando o Servidor Anchor

1. Clone (transfira) o repositório do GitHub e acesse a nova pasta criada:
    
    ```bash
    git clone https://github.com/garrettjoecox/anchor.git && cd anchor
    ```
    
2. Inicialize o servidor sem alterações, utilizando a porta padrão `43385`:
    
    ```bash
    deno run --allow-all mod.ts
    ```
    
3. Para executar em uma porta específica (caso queira usar a mesma do Minecraft, por exemplo):
    
    ```bash
    PORT={Nº da porta} deno run --allow-all mod.ts
    ```
    
4. Você pode realizar alterações no código editando o arquivo `mod.ts` na pasta `anchor`. Porém, o servidor já está funcional sem modificações.
    
5. O servidor estará ativo quando a seguinte mensagem for exibida:
    
    ```
    [Server]: Server Started on port {Nº da porta ativa}
    ```
    
6. Para encerrar o servidor:
    
    ```
    Ctrl+C
    ```
    

## Etapa 4 — Configurando o Ngrok (Repita o Procedimento do Servidor Anterior)

1. Acesse [ngrok.com](https://ngrok.com/).
    
2. Crie uma conta e faça login.
    
3. Na página **Dashboard**, selecione **Linux** em **Agents**.
    
4. Copie e cole o comando `curl` fornecido pelo site para instalar. Caso não funcione, use:
    
    ```bash
    apt install ngrok
    ```
    
5. Após instalar o programa, copie e cole o comando contendo o **Token de Autenticação** fornecido pelo site (algo parecido com isto):
    
    ```bash
    ngrok config add-authtoken [...]
    ```
    
6. Gere um link de acesso ao servidor:
    
    ```bash
    ngrok tcp 25565
    ```
    
    > [!question] Cada vez que é inicializado, o link gerado é diferente. O site requer o cadastro de um cartão de crédito, mas este serviço **não é cobrado** — serve apenas para verificar a identidade do usuário como pessoa física (assim como a Oracle faz).
    
    >[!tip] **IMPORTANTE:** Caso queira utilizar a porta `25565` para abrir a conexão ao servidor, **não execute simultaneamente** com o servidor Minecraft ou qualquer outro serviço que esteja utilizando esta porta. Caso queira registrar em outra porta, altere `25565` para outra. O padrão utilizado pelo Anchor é `43385`.
    
7. Se aparecer **"Status da sessão online"** em verde, a autenticação foi bem-sucedida. O link de acesso está na linha **Forwarding**. Copie a parte no formato:
    
    ```
    0.tcp.ngrok.io:12345
    ```
    

## Etapa 5 — Automatizando a Inicialização

1. Se os dois serviços estiverem funcionando corretamente, é necessário mantê-los ativos simultaneamente. Abra uma nova sessão apertando `Ctrl+Alt+C`.
    
2. Alterne entre as sessões com `Ctrl+Alt+↑/↓` ou `Ctrl+Alt+P/N`. Você também pode fazer isso pela aba do Termux.
    
3. Para simplificar, crie arquivos sem extensão para iniciar o servidor Anchor e o serviço do Ngrok:
    
    **Script do Anchor:**
    
    ```bash
    nano z
    ```
    
    Conteúdo:
    
    ```bash
    #!/bin/bash
    cd ./anchor
    PORT={Nº da porta} deno run --allow-all mod.ts
    ```
    
    Salve (`Ctrl+S`), saia (`Ctrl+X`) e dê permissão:
    
    ```bash
    chmod +x z
    ```
    
    **Script do Ngrok:**
    
    ```bash
    nano n
    ```
    
    Conteúdo:
    
    ```bash
    #!/bin/bash
    ngrok tcp 25565
    ```
    
    Salve (`Ctrl+S`), saia (`Ctrl+X`) e dê permissão:
    
    ```bash
    chmod +x n
    ```
    
4. Execute cada script em uma sessão separada:
    
    ```bash
    ./z
    ```
    
    ```bash
    ./n
    ```
    
5. Para encerrar os dois serviços, use `Ctrl+C` nas duas sessões ativas.
    

## Etapa 6 — Instalação do Ship of Harkinian

> O acesso ao servidor é realizado por meio de um build personalizado do programa, feito pelo próprio usuário **garrettjoecox**. Pule para a próxima etapa caso já tenha instalado.

1. Acesse [github.com/garrettjoecox/OOT/pull/64](https://github.com/garrettjoecox/OOT/pull/64) e baixe o `.zip` da aplicação no item **Build Artifacts**, de acordo com o sistema operacional do seu PC.
2. Descompacte o `.zip` e realize o processo de instalação do jogo. Você precisa obter o arquivo **ROM** do jogo — deve ser a **versão europeia** para funcionar corretamente.
3. Ao iniciar `soh.exe` pela primeira vez, ele solicitará a criação dos arquivos **OTR** e a localização da ROM. Aceite a criação, localize seu arquivo ROM e deixe o programa descompactar os assets do jogo.
4. Terminado o processo, execute `soh.exe` novamente e o jogo iniciará com as configurações padrão.

### Etapa 6.1 [OPCIONAL] — Configurações Adicionais

- **Configurações:** Pressionando `F1` é exibido um menu com opções como **Enhancements** (melhorias) e **Settings** (configurações gerais, incluindo controle). Por exemplo, é possível jogar sem limitação de FPS e com suporte a teclado e mouse.
- **Mods:** Você pode personalizar a aparência do jogo instalando modificações na pasta `mods`. Acesse [gamebanana.com/mods/games/16121](https://gamebanana.com/mods/games/16121) para ver diferentes opções feitas pela comunidade. Para alternar o uso dos mods durante o jogo, pressione `TAB` ou ative a opção **Enable Alternate Assets** no menu **Enhancements**.
    
    >[!tip] Os mods são aplicados localmente, na instalação do seu jogo — portanto, **não afetam os outros jogadores**.
    

## Etapa 7 — Conectando ao Servidor

1. Pressione `F1` para exibir o menu de configurações e abra a aba **Network**.
2. Insira as seguintes configurações:
    - **Remote Interaction Scheme:** selecione `Anchor`.
    - **Remote IP & Port:** escreva o endereço `0.tcp.ngrok.io` no primeiro campo e a porta no segundo.
    - **Outras configurações:** você pode alternar a cor do seu personagem para diferenciar de outros jogadores ativos, definir seu nome e o ID da sala. Também é possível ativar/desativar janelas de localização dos jogadores (**Player Location Window**) e de ações realizadas no servidor (**Incoming Item Window**).
3. Realizadas as configurações, selecione **Enable** para conectar-se ao servidor. Caso não funcione, verifique as configurações e se o servidor está rodando normalmente.

> [!tip] **IMPORTANTE:** Caso esteja jogando no modo **Randomizer**, é importante que os jogadores utilizem a mesma _seed_. Outro aspecto importante é que os jogadores tenham um arquivo de save criado e carregado antes de acessar o servidor, preferencialmente no mesmo ponto de partida, para que todos estejam alinhados na progressão do jogo.

Se tudo der certo, jogue e seja feliz!

---

### Fontes

1. [GitHub — garrettjoecox/OOT Pull Request_#64](https://github.com/garrettjoecox/OOT/pull/64)
2. [GitHub — garrettjoecox/anchor](https://github.com/garrettjoecox/anchor) — _contém mais informações, como alterar configurações de conexão, usar Docker, etc._
3. [Deno — Guia de Instalação](https://docs.deno.com/runtime/getting_started/installation/)
4. [GameBanana — Ocarina of Time Mods](https://gamebanana.com/mods/games/16121)
5. YouTube — Ocarina of Time Multiplayer Setup — pelo canal _A Couple of Average Gamers_
	https://www.youtube.com/watch?v=9YLnUKaJPVU