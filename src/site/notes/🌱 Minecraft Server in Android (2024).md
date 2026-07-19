---
{"title":{"pt":"🌱 Servidor Minecraft no Android (2024)","en":"🌱 Minecraft Server in Android (2024)"},"dg-publish":true,"permalink":"/minecraft-server-in-android-2024/","dg-note-properties":{}}
---

# 🌱 Como Hospedar um Servidor de Minecraft no Android

> [!tip] Aconselhável possuir um celular com 2GB a 4GB de RAM, conexão estável para baixar e instalar programas necessários, além de manter os serviços ativos, e conectar um teclado físico (via Bluetooth ou cabo OTG). Também é possível usar o app **Hacker's Keyboard**.

## Etapa 1 — Instalação do Termux e Ubuntu

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

> Por algum motivo, o Ubuntu instalado não possui esses dois comandos instalados por padrão.

Em seguida, instale o Java:

```bash
apt-get install software-properties-common
add-apt-repository ppa:openjdk-r/ppa
apt-get update
apt-get install openjdk-21-jdk   # Instale o mais recente
```

Certifique-se de que está instalado corretamente:

```bash
java -version
```

## Etapa 3 — Configurando o Servidor (Vanilla, mundo comum)

1. Certifique-se de que você está no diretório inicial:
    
    ```bash
    cd ~
    ```
    
2. Crie uma pasta para seu diretório e entre nela:
    
    ```bash
    mkdir mc && cd mc
    ```
    
3. Baixe o arquivo `.jar` do servidor do Minecraft. Você pode fazer isso a partir do site oficial do Minecraft ou de outro site, como o **PaperMC** (implementação de Spigot e plugins). Baixe o `.jar` correspondente à versão do seu Minecraft.
    
    **Servidor oficial (Vanilla):**
    
    ```bash
    wget -O minecraft_server.jar https://launcher.mojang.com/v1/objects/bb2b6b1aefcd70dfd1892149ac3a215f6c636b07/server.jar
    ```
    
    **Ou PaperMC:**
    
    ```bash
    wget -O minecraft_server.jar https://api.papermc.io/v2/projects/paper/versions/1.19.3/builds/448/downloads/paper-1.19.3-448.jar
    ```
    
4. Dê permissão de execução:
    
    ```bash
    chmod +x minecraft_server.jar
    ```
    
5. Inicie o servidor:
    
    ```bash
    java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui
    ```
    
    > Os valores em `-Xmx` e `-Xms` determinam, respectivamente, a memória RAM **máxima** e **mínima** dedicada ao servidor. Por segurança, deixe pelo menos 1 GB.
    
6. Na primeira execução, ocorrerá um erro pedindo para concordar com o `eula.txt`. Você também pode alterar parâmetros no `server.properties` para modificar as informações do servidor:
    
    ```bash
    nano server.properties
    ```
    
    - `max-players` → quantidade de jogadores
    - `online-mode` → permissão para entrada de contas não-legacy
    - `difficulty` → dificuldade, entre outros...
7. Edite o arquivo do EULA:
    
    ```bash
    nano eula.txt
    ```
    
    - Altere `eula=false` para `eula=true`
    - `Ctrl+S` para salvar, `Ctrl+X` para sair
8. Inicie o servidor novamente:
    
    ```bash
    java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui
    ```
    
9. Para encerrar o servidor, digite:
    
    ```bash
    stop
    ```
    

## Etapa 4 — Configurando o Ngrok (Acesso Externo)

1. Acesse [ngrok.com](https://ngrok.com/).
2. Crie uma conta e faça login.
3. Na página **Dashboard**, selecione **Linux** em **Agents**.
4. Copie e cole o comando `curl` fornecido pelo site para instalar. Caso não funcione, use:
    
    ```bash
    apt install ngrok
    ```
    
5. Após instalar o programa, copie e cole o comando contendo o **Token de Autenticação** fornecido pelo site.
6. Gere um link de acesso ao servidor:
    
    ```bash
    ngrok tcp 25565
    ```
    
    > Cada vez que é inicializado, o link gerado é diferente. O site requer o cadastro de um cartão de crédito, mas este serviço **não é cobrado** — serve apenas para verificar a identidade do usuário como pessoa física (assim como a Oracle faz).
    
7. Se aparecer **"Status da sessão online"** em verde, a autenticação foi bem-sucedida. O link de acesso está na linha **Forwarding**. Copie a parte no formato:
    
    ```
    0.tcp.ngrok.io:12345
    ```
    

## Etapa 5 — Automatizando a Inicialização

1. Se os dois serviços estiverem funcionando corretamente, é necessário mantê-los ativos simultaneamente. Abra uma nova sessão apertando `Ctrl+Alt+C`.
    
2. Alterne entre as sessões com `Ctrl+Alt+↑/↓` ou `Ctrl+Alt+P/N`. Você também pode fazer isso pela aba do Termux.
    
3. Para simplificar, crie arquivos sem extensão para iniciar o servidor de Minecraft e o serviço do Ngrok:
    
    **Script do servidor:**
    
    ```bash
    nano m
    ```
    
    Conteúdo:
    
    ```bash
    #!/bin/bash
    java -Xmx1024M -Xms1024M -jar minecraft_server.jar nogui
    ```
    
    Salve (`Ctrl+S`), saia (`Ctrl+X`) e dê permissão:
    
    ```bash
    chmod +x m
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
    ./m
    ```
    
    ```bash
    ./n
    ```
    
5. Para encerrar os dois serviços, use `Ctrl+C` nas duas sessões ativas.
    

## Etapa 6 — Conectando ao Servidor

1. Entre no Minecraft.
2. Selecione **Multijogador** → **Conexão Direta** e cole o link de acesso obtido no Ngrok.
3. Acesse e divirta-se!

---

### Fontes

1. [XDA Developers — Run Minecraft Server on Android](https://www.xda-developers.com/run-minecraft-server-android/)
2. [Reddit — Hosting a Minecraft Server on Android](https://www.reddit.com/r/Android/comments/glr4gc/hosting_a_minecraft_server_on_android_20/?rdt=57465) — _contém mais informações, como conexão via SSH, inserção de mundos criados anteriormente, instalação de Forge, e muito mais._
3. [Termux Wiki — Hardware Keyboard](https://wiki.termux.com/wiki/Hardware_Keyboard)