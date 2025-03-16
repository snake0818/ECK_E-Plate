const MainMenu = {
  key: 'MainMenu',
  preload: function () {
    // 設置加載進度文字
    const loadingText = this.add.text(GCX, GCY, 'Loading...', {
      fontSize: .1 * WIDTH,
      fill: '0x000000',
      fontFamily: 'Times New Roman'
    }).setOrigin(0.5, 0.5);
    // 監聽加載進度變化
    this.load.on('progress', (value) => { loadingText.setText(`Loading... ${Math.floor(value * 100)}`); });
    // 監聽加載完成事件
    this.load.on('complete', () => { loadingText.setText('Loading complete!'); loadingText.destroy(); });

    // 加載資源
    GeneralPreload(this);
    this.load.image('bg', `${PATH_UI}/bg/bg_game_menu.png`)
    this.load.image('btn_gameStart', `${PATH_UI}/buttons/btn_game_start.png`);
    this.load.image('btn_game1', `${PATH_UI}/buttons/btn_game1.png`);
    this.load.image('btn_game2', `${PATH_UI}/buttons/btn_game2.png`);
    this.load.image('btn_game3', `${PATH_UI}/buttons/btn_game3.png`);
    this.load.image('btn_game4', `${PATH_UI}/buttons/btn_game4.png`);
    this.load.image('btn_game5', `${PATH_UI}/buttons/btn_game5.png`);
    this.load.image('btn_game6', `${PATH_UI}/buttons/btn_game6.png`);
    this.load.audio('audio_title1', `${PATH_Audio}/titles/game_title1.m4a`);
    this.load.audio('audio_title2', `${PATH_Audio}/titles/game_title2.m4a`);
    this.load.audio('audio_title3', `${PATH_Audio}/titles/game_title3.m4a`);
    this.load.audio('audio_title4', `${PATH_Audio}/titles/game_title4.m4a`);
    this.load.audio('audio_title5', `${PATH_Audio}/titles/game_title5.m4a`);
    this.load.audio('audio_title6', `${PATH_Audio}/titles/game_title6.m4a`);
    this.load.audio('audio_start', `${PATH_Audio}/guides/guide_start.m4a`);
    this.load.audio('audio_select', `${PATH_Audio}/guides/guide_game_select.m4a`);
  },
  create: function () {
    const Size_BTN = 1.5 * imageSize; // 按鈕圖片大小
    // 設置背景
    const bg = this.add.image(GCX, GCY, 'start').setDisplaySize(WIDTH, HEIGHT);
    // 設置'開始遊戲'按鈕
    this.time.delayedCall(100, () => {
      const btn_game_start = this.add.image(GCX, 1.45 * GCY, 'btn_gameStart').setDisplaySize(2 * Size_BTN, Size_BTN);
      // '開始遊戲'按鈕點擊事件
      btn_game_start.setInteractive().on('pointerup', () => {
        // // 清除背景及按鈕
        // bg.destroy();
        btn_game_start.destroy();
        // 選擇遊戲
        selectGame();
      });
    });

    guide(this, 'audio_start');

    const selectGame = () => {
      let audio; // 宣告播放音效元素
      let audioSTATUS = false; // 宣告用於表示音訊播放狀態

      // 背景設置
      bg.setTexture('bg').setDisplaySize(WIDTH, HEIGHT);
      guide(this, 'audio_select');
      // 互動區域設置
      const interactive = this.add.rectangle(GCX, GCY, .75 * WIDTH, .4 * HEIGHT, DefaultCOLOR, SHOW).setDepth(Interactive_Depth);
      const [IA_x, IA_cx, IA_X, IA_y, IA_cy, IA_Y, IA_W, IA_H] = [
        interactive.x - .5 * interactive.width,
        interactive.x,
        interactive.x + .5 * interactive.width,
        interactive.y - .5 * interactive.height,
        interactive.y,
        interactive.y + .5 * interactive.height,
        interactive.width,
        interactive.height
      ];
      // 選擇遊戲按鈕設置
      const [btn_w, btn_h] = [.3 * IA_W, .4 * IA_H];
      const typeRegions = [
        { bounds: null, name: 'game1', value: 1 },
        { bounds: null, name: 'game2', value: 2 },
        { bounds: null, name: 'game3', value: 3 },
        { bounds: null, name: 'game4', value: 4 },
        { bounds: null, name: 'game5', value: 5 },
        { bounds: null, name: 'game6', value: 6 },
      ];
      for (let i = 0; i < typeRegions.length; i++) {
        const dx = IA_x + .375 * IA_W * (i % 3) + .5 * btn_w;
        const dy = (i < 3) ? IA_y + .6 * btn_h : IA_Y - .6 * btn_h;
        typeRegions[i].bounds = this.add.image(dx, dy, `btn_${typeRegions[i].name}`).setDisplaySize(btn_w, btn_h);
        // 點擊事件
        typeRegions[i].bounds.setInteractive()
          .on('pointerdown', () => {
            // 確保沒有播放音訊
            if (audioSTATUS) {
              audio.stop();
              audio.destroy();
              audioSTATUS = false;
            }
            // 清除當前情境之元件
            interactive.destroy();
            typeRegions.forEach(element => { element.bounds.destroy(); });
            GamingName = typeRegions[i].name;
            // 啟用指定遊戲場景
            this.scene.start(GamingName);
            GamingID = GamingName;
          })
          .on('pointerover', () => {
            if (!audioSTATUS) {
              audioSTATUS = true;
              // 播放音效
              audio = this.sound.add(`audio_title${i + 1}`);
              audio.play();

              // 音效播放結束
              audio.on('complete', () => {
                audioSTATUS = false;
              });
            }
          });
      }
    }

  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'app',
  scene: [MainMenu, game1, game2, game3, game4, game5, game6]
}
const game = new Phaser.Game(config);