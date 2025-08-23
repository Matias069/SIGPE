# SIGPE - Sistema Integrado de Gestão de Projetos da Expocanp

<!--
<div align="center">
    <img>
</div>
-->
<br>

## Clonando o repositório:
Digite o comando abaixo no *CMD* dentro da pasta onde deseja-se utilizar o projeto:
```
git clone https://github.com/Matias069/SIGPE.git
```

## Dependências
* **[Git](https://git-scm.com/downloads)**
* **npm (requer instalação do [Node.js](https://nodejs.org/pt/download))**
* **[PHP](https://www.php.net/downloads.php)**
* **[Composer](https://getcomposer.org/download/)**
* **[PostgreSQL](https://www.postgresql.org/download/)**

> [!TIP]
> Cheque se as dependências foram devidamente instaladas:
> * No **Prompt de Comando**, utilize os comandos de verificação de versão em todas as dependências
> * Na aplicação **Editar as variáveis de ambiente do sistema**, verifique se existe uma *Path* (do usuário ou do sistema) para cada dependência

#### Laravel:
1. **Na pasta de instalação do PHP**, duplique o arquivo `php.ini-production` e renomeie-o para **`php.ini`**
2. Remova o **`;`** da frente das seguintes variáveis:
    * `extension=curl`
    * `extension=fileinfo`
    * `extension=mbstring`
    * `extension=openssl`
    * `extension=pdo_pgsql`
    * `extension=pgsql`
    * `extension=zip`
3. Salve o arquivo
4. Abra o *CMD* e digite:
    ```
    composer global require laravel/installer
    ```

> [!TIP]
> * Cheque a instalação do Laravel digitando seu comando de versão no ***CMD*** e verificando sua ***Path***

## Instalação
**Instale as dependências do *front* e do *back*** com os seguintes comandos nas pastas informadas:
* Dentro da pasta `front` no *CMD*:
    ```
    npm install
    ```
* Dentro da pasta `back` no *CMD*:
    ```
    composer install
    ```

## Banco de Dados
1. Configure o PostgreSQL abrindo a aplicação **pgAdmin**
2. Localize o arquivo `.env.example` dentro de `SIGPE/back`, duplique-o e renomeie-o para **`.env`**
    * Dentro dele, modifique `DB_CONNECTION=` para **`DB_CONNECTION=pgsql`**
    * Modifique os atributos `DB_HOST=`, `DB_PORT=`, `DB_DATABASE=`,`DB_USERNAME=` e `DB_PASSWORD=` **de acordo com a configuração do PostgreSQL**, removendo os comentários (**`# `**) na frente de suas linhas
3. Dentro da pasta `back`, digite no ***CMD*** os comandos:
    ```
    php artisan key:generate
    php artisan migrate
    ```

## Rodando o Projeto
Abra **duas** instâncias do *CMD*, uma para o *frontend* e a outra para o *backend*, e digite os comandos a seguir **(as instâncias deverão permanecer abertas)**
1. Navegue até a pasta `SIGPE/front` e digite:
    ```
    npm run dev
    ```
2. Navegue até a pasta `SIGPE/back` e digite:
    ```
    php artisan serve
    ```

> [!NOTE]
> Caso apareça um erro na hora de rodar o projeto, siga as seguintes etapas:
>   * abra o **Windows Powershell** clicando em **`Executar como administrador`**
>   * Digite o comando abaixo:
>   ```
>   Set-ExecutionPolicy RemoteSigned
>   ```
>   * Digite **`S`** para confirmar
>   * Repita os passos da seção [**Rodando o Projeto**](#Rodando-o-Projeto)
