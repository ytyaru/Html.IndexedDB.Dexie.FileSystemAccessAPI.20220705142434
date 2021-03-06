window.addEventListener('DOMContentLoaded', async(event) => {
    try {
        window.mpurse.updateEmitter.removeAllListeners()
          .on('stateChanged', async(isUnlocked) => { /*await init();*/ console.log(isUnlocked); })
          .on('addressChanged', async(address) => { /*await init(address);*/ console.log(address); });
    } catch(e) { console.debug(e) }
    document.getElementById(`update`).addEventListener('click', async(event) => {
        sqlFile.db.exec(`INSERT INTO users(name) VALUES ('ytyaru');`)
        sqlFile.write()
        //const db = await this.sqlFile.read('users.db')
    })
    document.addEventListener('mastodon_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    document.addEventListener('misskey_redirect_approved', async(event) => {
        console.debug('===== misskey_redirect_approved =====')
        console.debug(event.detail)
        // actionを指定したときの入力と出力を表示する
        for (let i=0; i<event.detail.actions.length; i++) {
            console.debug(event.detail.actions[i], (event.detail.params) ? event.detail.params[i] : null, event.detail.results[i])
            console.debug(`----- ${event.detail.actions[i]} -----`)
            console.debug((event.detail.params) ? event.detail.params[i] : null)
            console.debug(event.detail.results[i])
        }
        // 認証リダイレクトで許可されたあとアクセストークンを生成して作成したclientを使ってAPIを発行する
        //const res = event.detail.client.toot(JSON.parse(event.detail.params[0]))
        // 独自処理
        for (let i=0; i<event.detail.actions.length; i++) {
            if ('note' == event.detail.actions[i]) {
                const html = new Comment().misskeyResToComment(event.detail.results[i].createdNote, event.detail.domain)
                const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
                comment.innerHTML = html + comment.innerHTML
            }
        }
    });
    document.addEventListener('misskey_redirect_rejected', async(event) => {
        console.debug('認証エラーです。認証を拒否しました。')
        console.debug(event.detail.error)
        console.debug(event.detail.error_description)
        Toaster.toast('キャンセルしました')
    });
    // リダイレクト認証後
    const reciverMastodon = new MastodonRedirectCallbackReciver()
    await reciverMastodon.recive()
    const reciverMisskey = new MisskeyRedirectCallbackReciver()
    await reciverMisskey.recive()
    Loading.setup()
    PartySparkleHart.setup()
    PartySparkleImage.setup()

Loading.setup()
    const sqlFile = new Sqlite3DbFile()

    // IndexedDBに保存されたディレクトリハンドルをロードするも関数までは保存されないらしい。
    // sqlite3-db-file.js:43 Uncaught (in promise) TypeError: dirHandle.getFileHandle is not a function
    await sqlFile.load() 

    const uploader = new Sqlite3DbUploader(sqlFile)
    uploader.setup() 
    const downloader = new Sqlite3DbDownloader(sqlFile)
    document.getElementById('download').addEventListener('click', async(event) => {
        downloader.download() 
    })
});
window.addEventListener('load', async(event) => {
    //Loading.hide()
})
