// Audio is created only after a user gesture. No sound files are downloaded.
export function createAmbientAudio() {
  let ctx;
  return {
    async play() {
      if (!ctx) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) throw new Error('当前浏览器不支持环境音乐。');
        ctx = new Audio();
        const gain = ctx.createGain();
        gain.gain.value = 0.035;
        gain.connect(ctx.destination);
        [130.81, 196, 261.63].forEach((frequency, index) => {
          const oscillator = ctx.createOscillator(),
            voice = ctx.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          voice.gain.value = 0.14;
          oscillator.connect(voice);
          voice.connect(gain);
          oscillator.start();
          const lfo = ctx.createOscillator(),
            depth = ctx.createGain();
          lfo.frequency.value = 0.06 + index * 0.019;
          depth.gain.value = 0.1;
          lfo.connect(depth);
          depth.connect(voice.gain);
          lfo.start();
        });
      }
      await ctx.resume();
    },
    async pause() {
      if (ctx) await ctx.suspend();
    },
  };
}
