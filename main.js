var V = Object.defineProperty;
var _ = (r, e, t) => e in r ? V(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var d = (r, e, t) => _(r, typeof e != "symbol" ? e + "" : e, t);
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload"))
    return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]'))
    s(i);
  new MutationObserver((i) => {
    for (const a of i)
      if (a.type === "childList")
        for (const h of a.addedNodes)
          h.tagName === "LINK" && h.rel === "modulepreload" && s(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(i) {
    const a = {};
    return i.integrity && (a.integrity = i.integrity), i.referrerPolicy && (a.referrerPolicy = i.referrerPolicy), i.crossOrigin === "use-credentials" ? a.credentials = "include" : i.crossOrigin === "anonymous" ? a.credentials = "omit" : a.credentials = "same-origin", a;
  }
  function s(i) {
    if (i.ep)
      return;
    i.ep = !0;
    const a = t(i);
    fetch(i.href, a);
  }
})();
class E {
  constructor() {
    this.subscribable = new X(this), this.subscribers = /* @__PURE__ */ new Set();
  }
  /**
   * {@inheritDoc Subscribable.subscribe}
   */
  subscribe(e) {
    return this.subscribers.add(e), () => this.unsubscribe(e);
  }
  /**
   * {@inheritDoc Subscribable.unsubscribe}
   */
  unsubscribe(e) {
    this.subscribers.delete(e);
  }
  /**
   * Unsubscribe all subscribers from the event.
   */
  clear() {
    this.subscribers.clear();
  }
  notifySubscribers(e) {
    return [...this.subscribers].map((t) => t(e));
  }
}
class X {
  constructor(e) {
    this.dispatcher = e;
  }
  /**
   * Subscribe to the event.
   *
   * @param handler - The handler to invoke when the event occurs.
   *
   * @returns A callback function that cancels the subscription.
   */
  subscribe(e) {
    return this.dispatcher.subscribe(e);
  }
  /**
   * Unsubscribe from the event.
   *
   * @param handler - The handler to unsubscribe.
   */
  unsubscribe(e) {
    this.dispatcher.unsubscribe(e);
  }
}
class ee extends E {
  async dispatch(e) {
    await Promise.all(this.notifySubscribers(e));
  }
}
class te extends E {
  dispatch(e) {
    this.notifySubscribers(e);
  }
}
class se extends E {
  constructor() {
    super(...arguments), this.value = !1;
  }
  /**
   * Notify all current and future subscribers.
   */
  raise() {
    this.value || (this.value = !0, this.notifySubscribers());
  }
  /**
   * Stop notifying future subscribers.
   */
  reset() {
    this.value = !1;
  }
  /**
   * Are subscribers being notified?
   */
  isRaised() {
    return this.value;
  }
  subscribe(e) {
    const t = super.subscribe(e);
    return this.value && e(), t;
  }
}
class b extends E {
  /**
   * {@inheritDoc SubscribableValueEvent.current}
   */
  get current() {
    return this.value;
  }
  /**
   * Set the current value of this dispatcher.
   *
   * @remarks
   * Setting the value will immediately notify all subscribers.
   *
   * @param value - The new value.
   */
  set current(e) {
    this.value = e, this.notifySubscribers(e);
  }
  /**
   * @param value - The initial value.
   */
  constructor(e) {
    super(), this.value = e, this.subscribable = new ie(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(e, t = !0) {
    const s = super.subscribe(e);
    return t && e(this.value), s;
  }
}
class ie extends X {
  /**
   * Get the most recent value of this dispatcher.
   */
  get current() {
    return this.dispatcher.current;
  }
  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler - The handler to invoke when the event occurs.
   * @param dispatchImmediately - Whether the handler should be immediately
   *                              invoked with the most recent value.
   *
   * @returns Callback function that cancels the subscription.
   */
  subscribe(e, t = !0) {
    return this.dispatcher.subscribe(e, t);
  }
}
class Y extends Error {
  constructor(e, t) {
    typeof e == "string" ? (super(e), this.remarks = t) : (super(e.message), this.remarks = e.remarks, this.object = e.object, this.durationMs = e.durationMs, this.inspect = e.inspect);
  }
}
class re {
  constructor() {
    this.resolveCurrent = null, this.current = null;
  }
  async acquire() {
    for (; this.current; )
      await this.current;
    this.current = new Promise((e) => {
      this.resolveCurrent = e;
    });
  }
  release() {
    var e;
    this.current = null, (e = this.resolveCurrent) == null || e.call(this), this.resolveCurrent = null;
  }
}
const U = [];
function ae() {
  const r = U.at(-1);
  if (!r)
    throw new Error("The scene is not available in the current context.");
  return r;
}
function $() {
  var r;
  return ((r = U.at(-1)) == null ? void 0 : r.logger) ?? console;
}
const ne = [];
function q() {
  const r = ne.at(-1);
  if (!r)
    throw new Y("The thread is not available in the current context.", `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`);
  return r;
}
function he(r) {
  return {
    message: r.message,
    stack: r.stack,
    remarks: r.remarks
  };
}
var x;
(function(r) {
  r[r.Playing = 0] = "Playing", r[r.Rendering = 1] = "Rendering", r[r.Paused = 2] = "Paused", r[r.Presenting = 3] = "Presenting";
})(x || (x = {}));
class le {
  constructor() {
    this.frame = 0, this.speed = 1, this.fps = 30, this.duration = 0, this.finished = !1, this.slides = [], this.previousScene = null, this.state = x.Paused, this.currentSceneReference = null, this.scenes = new b([]);
  }
  /**
   * Triggered when the active scene changes.
   *
   * @eventProperty
   */
  get onSceneChanged() {
    if (this.currentSceneReference === null)
      throw new Error("PlaybackManager has not been properly initialized");
    return this.currentSceneReference.subscribable;
  }
  /**
   * Triggered when the scenes get recalculated.
   *
   * @remarks
   * This event indicates that the timing of at least one scene has changed.
   *
   * @eventProperty
   */
  get onScenesRecalculated() {
    return this.scenes.subscribable;
  }
  get currentScene() {
    if (this.currentSceneReference === null)
      throw new Error("PlaybackManager has not been properly initialized");
    return this.currentSceneReference.current;
  }
  set currentScene(e) {
    if (!e)
      throw new Error("Invalid scene.");
    this.currentSceneReference ?? (this.currentSceneReference = new b(e)), this.currentSceneReference.current = e;
  }
  setup(e) {
    this.scenes.current = e, this.currentScene = e[0];
  }
  async progress() {
    return this.finished = await this.next(), this.finished;
  }
  async seek(e) {
    if (e <= this.frame || this.currentScene.isCached() && this.currentScene.lastFrame < e) {
      const t = this.findBestScene(e);
      t !== this.currentScene ? (this.previousScene = null, this.currentScene = t, this.frame = this.currentScene.firstFrame, await this.currentScene.reset()) : this.frame >= e && (this.previousScene = null, this.frame = this.currentScene.firstFrame, await this.currentScene.reset());
    }
    for (this.finished = !1; this.frame < e && !this.finished; )
      this.finished = await this.next();
    return this.finished;
  }
  async goBack() {
    let e = this.currentScene.slides.getCurrent();
    if (e && this.currentScene.slides.isWaiting()) {
      const t = this.slides.indexOf(e);
      e = this.slides[t - 1];
    }
    await this.seekSlide(e);
  }
  async goForward() {
    const e = this.currentScene.slides.getCurrent(), t = this.slides.indexOf(e);
    await this.seekSlide(this.slides[t + 1]);
  }
  async goTo(e) {
    await this.seekSlide(this.slides.find((t) => t.id === e));
  }
  async seekSlide(e = null) {
    if (!e)
      return;
    const { id: t, scene: s } = e;
    for ((this.currentScene !== s || this.currentScene.slides.didHappen(t)) && (this.previousScene = null, this.currentScene = s, this.frame = this.currentScene.firstFrame, this.currentScene.slides.setTarget(t), await this.currentScene.reset()), this.finished = !1, this.currentScene.slides.setTarget(t); !this.currentScene.slides.isWaitingFor(t) && !this.finished; )
      this.finished = await this.next();
    return this.currentScene.slides.setTarget(null), this.finished;
  }
  async reset() {
    this.previousScene = null, this.currentScene = this.scenes.current[0], this.frame = 0, this.finished = !1, await this.currentScene.reset();
  }
  reload(e) {
    this.scenes.current.forEach((t) => t.reload(e));
  }
  async recalculate() {
    this.previousScene = null, this.slides = [];
    const e = this.speed;
    this.frame = 0, this.speed = 1;
    const t = [];
    try {
      for (const s of this.scenes.current)
        await s.recalculate((i) => {
          this.frame = i;
        }), this.slides.push(...s.slides.onChanged.current), t.push(s);
    } finally {
      this.speed = e;
    }
    this.scenes.current = t, this.duration = this.frame;
  }
  async next() {
    if (this.previousScene && (await this.previousScene.next(), this.currentScene.isFinished() && (this.previousScene = null)), this.frame += this.speed, this.currentScene.isFinished())
      return !0;
    if (await this.currentScene.next(), this.previousScene && this.currentScene.isAfterTransitionIn() && (this.previousScene = null), this.currentScene.canTransitionOut()) {
      this.previousScene = this.currentScene;
      const e = this.getNextScene(this.previousScene);
      e && (this.currentScene = e, await this.currentScene.reset(this.previousScene)), (!e || this.currentScene.isAfterTransitionIn()) && (this.previousScene = null);
    }
    return this.currentScene.isFinished();
  }
  findBestScene(e) {
    let t = this.scenes.current[0];
    for (const s of this.scenes.current) {
      if (!s.isCached() || s.lastFrame > e)
        return s;
      t = s;
    }
    return t;
  }
  getNextScene(e) {
    const t = this.scenes.current;
    if (!e)
      return t[0];
    const s = t.findIndex((i) => i === e);
    return s < 0 ? null : t[s + 1] ?? null;
  }
}
class oe {
  constructor(e) {
    this.playback = e;
  }
  /**
   * Convert seconds to frames using the current framerate.
   *
   * @param seconds - The seconds to convert.
   */
  secondsToFrames(e) {
    return Math.ceil(e * this.playback.fps);
  }
  /**
   * Convert frames to seconds using the current framerate.
   *
   * @param frames - The frames to convert.
   */
  framesToSeconds(e) {
    return e / this.playback.fps;
  }
  get time() {
    return this.framesToSeconds(this.playback.frame);
  }
  get frame() {
    return this.playback.frame;
  }
  get speed() {
    return this.playback.speed;
  }
  get fps() {
    return this.playback.fps;
  }
  get state() {
    return this.playback.state;
  }
  /**
   * The time passed since the last frame in seconds.
   */
  get deltaTime() {
    return this.framesToSeconds(1) * this.speed;
  }
}
class ue {
  get onDataChanged() {
    return this.data.subscribable;
  }
  constructor(e) {
    this.logger = e, this.data = new b(null), this.context = new AudioContext(), this.audioElement = new Audio(), this.source = null, this.error = !1, this.abortController = null, this.offset = 0;
  }
  getTime() {
    return this.toAbsoluteTime(this.audioElement.currentTime);
  }
  setTime(e) {
    this.audioElement.currentTime = this.toRelativeTime(e);
  }
  setOffset(e) {
    this.offset = e;
  }
  setMuted(e) {
    this.audioElement.muted = e;
  }
  setVolume(e) {
    this.audioElement.volume = e;
  }
  setSource(e) {
    var t;
    this.source = e, this.audioElement.src = e, (t = this.abortController) == null || t.abort(), this.abortController = new AbortController(), this.loadData(this.abortController.signal).catch((s) => {
      s.name !== "AbortError" && this.logger.error(s);
    });
  }
  isInRange(e) {
    return e >= this.offset && e < this.audioElement.duration;
  }
  toRelativeTime(e) {
    return Math.max(0, e - this.offset);
  }
  toAbsoluteTime(e) {
    return e + this.offset;
  }
  isReady() {
    return this.source && !this.error;
  }
  /**
   * Pause/resume the audio.
   *
   * @param isPaused - Whether the audio should be paused or resumed.
   *
   * @returns `true` if the audio successfully started playing.
   */
  async setPaused(e) {
    if (this.source && this.audioElement.paused !== e)
      if (e)
        this.audioElement.pause();
      else
        try {
          return await this.audioElement.play(), this.error = !1, !0;
        } catch (t) {
          this.error || $().error(t), this.error = !0;
        }
    return !1;
  }
  async loadData(e) {
    if (this.data.current = null, !this.source)
      return;
    const s = await (await fetch(this.source, { signal: e })).arrayBuffer();
    if (e.aborted)
      return;
    let i;
    try {
      i = await this.decodeAudioData(s);
    } catch {
      return;
    }
    if (e.aborted)
      return;
    const a = 256, h = ~~(i.length / a), l = [];
    let u = 0;
    for (let o = 0; o < i.numberOfChannels; o++) {
      const c = i.getChannelData(o);
      for (let p = 0; p < h; p++) {
        const m = ~~(p * a), P = ~~(m + a);
        let y = c[m], w = y;
        for (let M = m; M < P; M++) {
          const I = c[M];
          I > w && (w = I), I < y && (y = I);
        }
        (o === 0 || w > l[p * 2]) && (l[p * 2] = w), (o === 0 || y < l[p * 2 + 1]) && (l[p * 2 + 1] = y), w > u && (u = w), Math.abs(y) > u && (u = Math.abs(y));
      }
    }
    this.data.current = {
      peaks: l,
      absoluteMax: u,
      length: h,
      sampleRate: i.sampleRate / a * 2
    };
  }
  decodeAudioData(e) {
    return new Promise((t, s) => this.context.decodeAudioData(e, t, s).catch(s));
  }
}
class ce {
  get onChanged() {
    return this.events.subscribable;
  }
  constructor(e) {
    this.scene = e, this.events = new b([]), this.registeredEvents = /* @__PURE__ */ new Map(), this.lookup = /* @__PURE__ */ new Map(), this.collisionLookup = /* @__PURE__ */ new Set(), this.previousReference = [], this.didEventsChange = !1, this.preserveTiming = !0, this.handleReload = () => {
      this.registeredEvents.clear(), this.collisionLookup.clear();
    }, this.handleRecalculated = () => {
      var t;
      this.preserveTiming = !0, this.events.current = [...this.registeredEvents.values()], (this.didEventsChange || (((t = this.previousReference) == null ? void 0 : t.length) ?? 0) !== this.events.current.length) && (this.didEventsChange = !1, this.previousReference = [...this.registeredEvents.values()].map((s) => ({
        name: s.name,
        targetTime: s.targetTime
      })), this.scene.meta.timeEvents.set(this.previousReference));
    }, this.handleReset = () => {
      this.collisionLookup.clear();
    }, this.handleMetaChanged = (t) => {
      t !== this.previousReference && (this.previousReference = t, this.load(t), this.scene.reload());
    }, this.previousReference = e.meta.timeEvents.get(), this.load(this.previousReference), e.onReloaded.subscribe(this.handleReload), e.onRecalculated.subscribe(this.handleRecalculated), e.onReset.subscribe(this.handleReset), e.meta.timeEvents.onChanged.subscribe(this.handleMetaChanged, !1);
  }
  set(e, t, s = !0) {
    let i = this.lookup.get(e);
    !i || i.offset === t || (this.preserveTiming = s, i = {
      ...i,
      targetTime: i.initialTime + t,
      offset: t
    }, this.lookup.set(e, i), this.registeredEvents.set(e, i), this.events.current = [...this.registeredEvents.values()], this.didEventsChange = !0, this.scene.reload());
  }
  register(e, t) {
    if (this.collisionLookup.has(e))
      return this.scene.logger.error({
        message: `name "${e}" has already been used for another event name.`,
        stack: new Error().stack
      }), 0;
    this.collisionLookup.add(e);
    let s = this.lookup.get(e);
    if (!s)
      this.didEventsChange = !0, s = {
        name: e,
        initialTime: t,
        targetTime: t,
        offset: 0,
        stack: new Error().stack
      }, this.lookup.set(e, s);
    else {
      let i = !1;
      const a = { ...s }, h = new Error().stack;
      a.stack !== h && (a.stack = h, i = !0), a.initialTime !== t && (a.initialTime = t, i = !0);
      const l = Math.max(0, a.targetTime - a.initialTime);
      this.preserveTiming && a.offset !== l && (a.offset = l, i = !0);
      const u = a.initialTime + a.offset;
      !this.preserveTiming && a.targetTime !== u && (this.didEventsChange = !0, a.targetTime = u, i = !0), i && (s = a, this.lookup.set(e, s));
    }
    return this.registeredEvents.set(e, s), s.offset;
  }
  load(e) {
    for (const t of e) {
      if (typeof t.name != "string")
        continue;
      const s = this.lookup.get(t.name) ?? {
        name: t.name,
        initialTime: 0,
        offset: 0
      };
      this.lookup.set(t.name, {
        ...s,
        targetTime: t.targetTime ?? 0
      });
    }
  }
}
const j = /^\/\/# sourceURL=(.*)$/gm, de = /ERROR: \d+:(\d+): (.*)/g, fe = /^'([^']+)'/;
class pe {
  constructor(e) {
    this.logger = e, this.gl = null, this.currentOwner = null, this.programLookup = /* @__PURE__ */ new Map();
  }
  borrow(e) {
    var t;
    return this.currentOwner === e ? this.gl : ((t = this.currentOwner) == null || t.teardown(this.gl), this.currentOwner = e, this.currentOwner.setup(this.getGL()), this.gl);
  }
  /**
   * Dispose the WebGL context to free up resources.
   */
  dispose() {
    var e, t;
    if (this.gl) {
      (e = this.currentOwner) == null || e.teardown(this.gl), this.currentOwner = null, this.gl.useProgram(null);
      for (const { program: s, fragment: i, vertex: a } of this.programLookup.values())
        this.gl.deleteProgram(s), this.gl.deleteShader(i), this.gl.deleteShader(a);
      this.programLookup.clear(), (t = this.gl.getExtension("WEBGL_lose_context")) == null || t.loseContext(), this.gl.canvas.remove(), this.gl = null;
    }
  }
  getProgram(e, t) {
    const s = `${e}#${t}`;
    if (this.programLookup.has(s))
      return this.programLookup.get(s).program;
    const i = this.getGL(), a = this.getShader(i.FRAGMENT_SHADER, e), h = this.getShader(i.VERTEX_SHADER, t);
    if (!a || !h)
      return null;
    const l = i.createProgram();
    return i.attachShader(l, a), i.attachShader(l, h), i.linkProgram(l), i.getProgramParameter(l, i.LINK_STATUS) ? (this.programLookup.set(s, {
      program: l,
      fragment: a,
      vertex: h
    }), l) : (this.logger.error({
      message: "Failed to initialize the shader program.",
      remarks: i.getProgramInfoLog(l) ?? void 0,
      stack: new Error().stack
    }), i.deleteProgram(l), null);
  }
  getShader(e, t) {
    const s = this.getGL(), i = s.createShader(e);
    if (s.shaderSource(i, t), s.compileShader(i), !s.getShaderParameter(i, s.COMPILE_STATUS)) {
      const a = s.getShaderInfoLog(i);
      return ge(this.logger, a, t), s.deleteShader(i), null;
    }
    return i;
  }
  getGL() {
    if (this.gl)
      return this.gl;
    if (this.gl = document.createElement("canvas").getContext("webgl2", {
      depth: !1,
      premultipliedAlpha: !1,
      stencil: !1,
      powerPreference: "high-performance"
    }), !this.gl)
      throw new Error("Failed to initialize WebGL.");
    return this.gl;
  }
}
function ge(r, e, t) {
  let s = null;
  j.lastIndex = 0;
  const i = j.exec(t);
  if (i) {
    const l = new URL(i[1], window.location.origin);
    l.searchParams.set("t", Date.now().toString()), s = l.toString();
  }
  if (!e)
    return r.error({
      message: "Unknown shader compilation error.",
      stack: C(s, 1, 0)
    }), null;
  let a = !1, h;
  for (; h = de.exec(e); ) {
    const [, l, u] = h;
    let o = 0;
    const c = u.match(fe);
    if (c) {
      const m = t.split(`
`)[parseInt(l) - 1].indexOf(c[1]);
      if (m !== -1 && (o = m), c[1] === "include" && t.split(`
`).find((y) => y.startsWith("#include"))) {
        a = !0, r.error({
          message: `Shader compilation error: ${u}`,
          remarks: `<p>The <code>#include</code> directive requires the use of a preprocessor.</p>
<p>Make sure to import the shader from a file:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">import</span> shader <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./shader.glsl&#x27;</span>;</code></pre><p>Do <strong>NOT</strong> use the raw loader:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">import</span> shader <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./shader.glsl?raw&#x27;</span>;</code></pre><p>Do <strong>NOT</strong> use <code>#include</code> in an inline string:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">const</span> shader = <span class="hljs-string">\`\\
#include &quot;example.glsl&quot;
\`</span>;</code></pre><p><a href='https://motioncanvas.io/docs/shaders' target='_blank'>Learn more</a> about working with shaders.</p>
`
        });
        break;
      }
    }
    a = !0, r.error({
      message: `Shader compilation error: ${u}`,
      stack: C(s, l, o)
    });
  }
  a || r.error({
    message: `Shader compilation error: ${e}`,
    stack: C(s, 1, 0)
  });
}
function C(r, e, t) {
  if (r)
    return navigator.userAgent.toLowerCase().includes("chrome") ? `  at (${r}:${e}:${t})` : `@${r}:${e}:${t}`;
}
const D = 1 / 50;
class me {
  /**
   * Triggered during each iteration of the update loop when the frame is ready
   * to be rendered.
   *
   * @remarks
   * Player does not perform any rendering on its own. For the animation to be
   * visible, another class must subscribe to this event and perform the
   * rendering itself. {@link Stage} can be used to display the animation.
   *
   * @eventProperty
   */
  get onRender() {
    return this.render.subscribable;
  }
  get onStateChanged() {
    return this.playerState.subscribable;
  }
  get onFrameChanged() {
    return this.frame.subscribable;
  }
  get onDurationChanged() {
    return this.duration.subscribable;
  }
  /**
   * Triggered right after recalculation finishes.
   *
   * @remarks
   * Can be used to provide visual feedback.
   *
   * @eventProperty
   */
  get onRecalculated() {
    return this.recalculated.subscribable;
  }
  get startFrame() {
    return Math.min(this.playback.duration, this.status.secondsToFrames(this.startTime));
  }
  get endFrame() {
    return Math.min(this.playback.duration, this.status.secondsToFrames(this.endTime));
  }
  get finished() {
    return this.playback.finished || this.playback.frame >= this.endFrame;
  }
  constructor(e, t = {}, s = {}, i = -1) {
    var h, l, u;
    this.project = e, this.settings = t, this.initialState = s, this.initialFrame = i, this.render = new ee(), this.frame = new b(0), this.duration = new b(0), this.recalculated = new te(), this.lock = new re(), this.startTime = 0, this.endTime = 1 / 0, this.requestId = null, this.renderTime = 0, this.requestedSeek = -1, this.requestedRender = !1, this.requestedRecalculation = !0, this.active = !1, this.playerState = new b({
      loop: !0,
      muted: !0,
      volume: 1,
      speed: 1,
      ...s,
      paused: !0
    }), this.sharedWebGLContext = new pe(this.project.logger), this.requestedSeek = i, this.logger = this.project.logger, this.playback = new le(), this.status = new oe(this.playback), this.audio = new ue(this.logger), this.size = t.size ?? new n(1920, 1080), this.resolutionScale = t.resolutionScale ?? 1, this.startTime = ((h = t.range) == null ? void 0 : h[0]) ?? 0, this.endTime = ((l = t.range) == null ? void 0 : l[1]) ?? 1 / 0, this.playback.fps = t.fps ?? 60, this.audio.setOffset(t.audioOffset ?? 0), e.audio && this.audio.setSource(e.audio);
    const a = [];
    for (const o of e.scenes) {
      const c = new o.klass({
        ...o,
        playback: this.status,
        logger: this.project.logger,
        size: this.size,
        resolutionScale: this.resolutionScale,
        timeEventsClass: ce,
        sharedWebGLContext: this.sharedWebGLContext,
        experimentalFeatures: e.experimentalFeatures
      });
      (u = o.onReplaced) == null || u.subscribe((p) => {
        c.reload(p);
      }, !1), c.onReloaded.subscribe(() => this.requestRecalculation()), c.variables.updateSignals(e.variables ?? {}), a.push(c);
    }
    this.playback.setup(a), this.activate();
  }
  async configure(e) {
    await this.lock.acquire();
    let t = this.playback.frame, s = !1;
    this.startTime = e.range[0], this.endTime = e.range[1];
    const i = Math.max(1, e.fps);
    if (this.playback.fps !== i) {
      const a = i / this.playback.fps;
      this.playback.fps = i, t = Math.floor(t * a), s = !0;
    }
    (!e.size.exactlyEquals(this.size) || e.resolutionScale !== this.resolutionScale) && (this.size = e.size, this.resolutionScale = e.resolutionScale, this.playback.reload({
      size: this.size,
      resolutionScale: this.resolutionScale
    })), e.audioOffset !== void 0 && this.audio.setOffset(e.audioOffset), this.lock.release(), s && (this.playback.reload(), this.frame.current = t, this.requestRecalculation(), this.requestedSeek = t);
  }
  /**
   * Whether the given frame is inside the animation range.
   *
   * @param frame - The frame to check.
   */
  isInRange(e) {
    return e >= 0 && e <= this.playback.duration;
  }
  /**
   * Whether the given frame is inside the user-defined range.
   *
   * @param frame - The frame to check.
   */
  isInUserRange(e) {
    return e >= this.startFrame && e <= this.endFrame;
  }
  requestSeek(e) {
    this.requestedSeek = this.clampRange(e);
  }
  requestPreviousFrame() {
    this.requestedSeek = this.frame.current - this.playback.speed;
  }
  requestNextFrame() {
    this.requestedSeek = this.frame.current + this.playback.speed;
  }
  requestReset() {
    this.requestedSeek = 0;
  }
  requestRender() {
    this.requestedRender = !0;
  }
  toggleLoop(e = !this.playerState.current.loop) {
    e !== this.playerState.current.loop && (this.playerState.current = {
      ...this.playerState.current,
      loop: e
    });
  }
  togglePlayback(e = this.playerState.current.paused) {
    e === this.playerState.current.paused && (this.playerState.current = {
      ...this.playerState.current,
      paused: !e
    }, e && !this.playerState.current.loop && this.playback.frame === this.playback.duration && this.requestReset());
  }
  toggleAudio(e = this.playerState.current.muted) {
    e === this.playerState.current.muted && (this.playerState.current = {
      ...this.playerState.current,
      muted: !e
    });
  }
  setAudioVolume(e) {
    const t = R(0, 1, e);
    t !== this.playerState.current.volume && (this.playerState.current = {
      ...this.playerState.current,
      volume: t
    });
  }
  addAudioVolume(e) {
    this.setAudioVolume(this.playerState.current.volume + e);
  }
  setSpeed(e) {
    e !== this.playerState.current.speed && (this.playback.speed = e, this.playback.reload(), this.playerState.current = {
      ...this.playerState.current,
      speed: e
    }, this.requestRecalculation());
  }
  setVariables(e) {
    for (const t of this.playback.onScenesRecalculated.current)
      t.variables.updateSignals(e);
  }
  /**
   * Activate the player.
   *
   * @remarks
   * A player needs to be active in order for the update loop to run. Each
   * player is active by default.
   */
  activate() {
    this.active = !0, this.request();
  }
  /**
   * Deactivate the player.
   *
   * @remarks
   * Deactivating the player prevents its update loop from running. This should
   * be done before disposing the player, to prevent it from running in the
   * background.
   *
   * Just pausing the player does not stop the loop.
   */
  deactivate() {
    this.active = !1, this.sharedWebGLContext.dispose(), this.requestId !== null && (cancelAnimationFrame(this.requestId), this.requestId = null);
  }
  requestRecalculation() {
    this.requestedRecalculation = !0, this.request();
  }
  async prepare() {
    const e = {
      ...this.playerState.current,
      seek: this.requestedSeek,
      render: this.requestedRender
    };
    if (this.requestedSeek = -1, this.requestedRender = !1, this.requestedRecalculation) {
      e.seek < 0 && (e.seek = this.playback.frame);
      try {
        await this.playback.recalculate(), this.duration.current = this.playback.frame, this.recalculated.dispatch();
      } catch (s) {
        throw this.requestSeek(e.seek), s;
      } finally {
        this.requestedRecalculation = !1;
      }
    }
    (!e.loop && this.finished && !e.paused && e.seek < 0 || this.endFrame === this.startFrame) && (this.togglePlayback(!1), e.paused = !0, e.seek = this.endFrame === this.startFrame ? e.seek : this.startFrame), e.loop && (e.seek > this.endFrame || this.finished && !e.paused) && this.startFrame !== this.endTime && (e.seek = this.startFrame);
    const t = e.paused || this.finished || !this.audio.isInRange(this.status.time);
    return await this.audio.setPaused(t) && this.syncAudio(-3), this.audio.setMuted(e.muted), this.audio.setVolume(e.volume), e;
  }
  async run() {
    const e = await this.prepare(), t = this.playback.state;
    if (this.playback.state = e.paused ? x.Paused : x.Playing, e.seek >= 0 || !this.isInUserRange(this.status.frame)) {
      const s = e.seek < 0 ? this.status.frame : e.seek, i = this.clampRange(s);
      this.logger.profile("seek time"), await this.playback.seek(i), this.logger.profile("seek time"), this.syncAudio(-3);
    } else if (e.paused || e.speed === 1 && this.audio.isReady() && this.audio.isInRange(this.status.time) && this.audio.getTime() < this.status.time) {
      (e.render || e.paused && t !== x.Paused) && await this.render.dispatch(), !e.paused && this.status.time > this.audio.getTime() + D && this.syncAudio(), this.request();
      return;
    } else if (this.audio.isReady() && e.speed === 1 && this.audio.isInRange(this.status.time) && this.status.framesToSeconds(this.playback.frame + 1) < this.audio.getTime() - D) {
      const s = this.status.secondsToFrames(this.audio.getTime());
      await this.playback.seek(s);
    } else this.status.frame < this.endFrame && (await this.playback.progress(), e.speed !== 1 && this.syncAudio());
    !e.paused && this.playback.currentScene.slides.isWaiting() && (this.togglePlayback(!1), e.paused = !0), await this.render.dispatch(), this.frame.current = this.playback.frame, this.request();
  }
  request() {
    this.active && (this.requestId ?? (this.requestId = requestAnimationFrame(async (e) => {
      if (this.requestId = null, e - this.renderTime >= 1e3 / (this.status.fps + 5)) {
        this.renderTime = e, await this.lock.acquire();
        try {
          await this.run();
        } catch (t) {
          this.logger.error(t);
        }
        this.lock.release();
      } else
        this.request();
    })));
  }
  clampRange(e) {
    return R(this.startFrame, this.endFrame, e);
  }
  syncAudio(e = 0) {
    this.audio.setTime(this.status.framesToSeconds(this.playback.frame + e));
  }
}
class ye {
  get canvasSize() {
    return this.size.scale(this.resolutionScale);
  }
  constructor() {
    this.background = null, this.resolutionScale = 1, this.colorSpace = "srgb", this.size = n.zero, this.finalBuffer = document.createElement("canvas"), this.currentBuffer = document.createElement("canvas"), this.previousBuffer = document.createElement("canvas");
    const e = this.colorSpace;
    this.context = S({ colorSpace: e }, this.finalBuffer), this.currentContext = S({ colorSpace: e }, this.currentBuffer), this.previousContext = S({ colorSpace: e }, this.previousBuffer);
  }
  configure({ colorSpace: e = this.colorSpace, size: t = this.size, resolutionScale: s = this.resolutionScale, background: i = this.background }) {
    e !== this.colorSpace && (this.colorSpace = e, this.context = S({ colorSpace: e }, this.finalBuffer), this.currentContext = S({ colorSpace: e }, this.currentBuffer), this.previousContext = S({ colorSpace: e }, this.previousBuffer)), (!t.exactlyEquals(this.size) || s !== this.resolutionScale) && (this.resolutionScale = s, this.size = t, this.resizeCanvas(this.context), this.resizeCanvas(this.currentContext), this.resizeCanvas(this.previousContext)), this.background = typeof i == "string" ? i : (i == null ? void 0 : i.serialize()) ?? null;
  }
  async render(e, t) {
    const s = t ? Q(e.previousOnTop) : !1;
    t && await t.render(this.previousContext), await e.render(this.currentContext);
    const i = this.canvasSize;
    this.context.clearRect(0, 0, i.width, i.height), this.background && (this.context.save(), this.context.fillStyle = this.background, this.context.fillRect(0, 0, i.width, i.height), this.context.restore()), t && !s && this.context.drawImage(this.previousBuffer, 0, 0), this.context.drawImage(this.currentBuffer, 0, 0), s && this.context.drawImage(this.previousBuffer, 0, 0);
  }
  resizeCanvas(e) {
    const t = this.canvasSize;
    e.canvas.width = t.width, e.canvas.height = t.height;
  }
}
function S(r, e = document.createElement("canvas")) {
  const t = e.getContext("2d", r);
  if (!t)
    throw new Error("Could not create a 2D context.");
  return t;
}
const ve = 180 / Math.PI, L = Math.PI / 180;
function be(r) {
  const e = ae(), t = q();
  return e.timeEvents.register(r, t.time());
}
const we = [];
function Se() {
  const r = we.at(-1);
  if (!r)
    throw new Error("The playback is not available in the current context.");
  return r;
}
function N(r, ...e) {
  const t = { [r.name]: r }, s = Object.getOwnPropertyDescriptor(t, r.name);
  if (s)
    for (let i = e.length - 1; i >= 0; i--)
      e[i](t, r.name, s);
}
function O(r) {
  return function(e, t, s) {
    s.value.prototype.name = t, s.value.prototype.threadable = !0;
  };
}
N(ke, O());
function* ke(r, e) {
  yield* z(be(r)), e && (yield* e);
}
N(z, O());
function* z(r = 0, e) {
  const t = q(), s = Se().framesToSeconds(1), i = t.time() + r;
  for (; i - s > t.fixed; )
    yield;
  t.time(i), e && (yield* e);
}
function B(r, e) {
  let t;
  return typeof r == "string" ? (t = e(), F(t, r)) : (t = r(), F(t, t)), t;
}
function F(r, e) {
  const t = Object.getPrototypeOf(r);
  t.threadable || (t.threadable = !0, t.name = typeof e == "string" ? e : xe(e));
}
function xe(r) {
  return Object.getPrototypeOf(r).name ?? null;
}
function v(r, e, t) {
  return r + (e - r) * t;
}
function R(r, e, t) {
  return t < r ? r : t > e ? e : t;
}
function Te(r, e, t) {
  let s = e;
  t > 1 ? t = 1 / t : s = !s;
  const i = s ? Math.acos(R(-1, 1, 1 - r)) : Math.asin(r), a = v(i, v(0, Math.PI / 2, r), t);
  let h = Math.sin(a), l = 1 - Math.cos(a);
  return e && ([h, l] = [l, h]), new n(h, l);
}
function Pe(r, e = 0, t = 1) {
  return r = r < 0.5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2, v(e, t, r);
}
N(J, O());
function* J(r, e, t) {
  const s = q(), i = s.time(), a = s.time() + r;
  for (e(0, 0); a > s.fixed; ) {
    const h = s.fixed - i, l = h / r;
    h > 0 && e(l, h), yield;
  }
  s.time(a), e(1, r), t == null || t(1, r);
}
class g {
  static collectPromise(e, t = null) {
    const s = {
      promise: e,
      value: t,
      stack: new Error().stack
    }, i = this.collectionStack.at(-1);
    return i && (s.owner = i.owner), e.then((a) => {
      s.value = a, i == null || i.markDirty();
    }), this.promises.push(s), s;
  }
  static hasPromises() {
    return this.promises.length > 0;
  }
  static async consumePromises() {
    const e = [...this.promises];
    return await Promise.all(e.map((t) => t.promise)), this.promises = this.promises.filter((t) => !e.includes(t)), e;
  }
  constructor(e) {
    this.owner = e, this.dependencies = /* @__PURE__ */ new Set(), this.event = new se(), this.markDirty = () => this.event.raise(), this.invokable = this.invoke.bind(this), Object.defineProperty(this.invokable, "context", {
      value: this
    }), Object.defineProperty(this.invokable, "toPromise", {
      value: this.toPromise.bind(this)
    });
  }
  invoke() {
  }
  startCollecting() {
    if (g.collectionSet.has(this))
      throw new Y("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    g.collectionSet.add(this), g.collectionStack.push(this);
  }
  finishCollecting() {
    if (g.collectionSet.delete(this), g.collectionStack.pop() !== this)
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((e) => e.unsubscribe(this.markDirty)), this.dependencies.clear();
  }
  collect() {
    const e = g.collectionStack.at(-1);
    e && (e.dependencies.add(this.event.subscribable), this.event.subscribe(e.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), this.owner = null;
  }
  async toPromise() {
    do
      await g.consumePromises(), this.invokable();
    while (g.hasPromises());
    return this.invokable;
  }
}
g.collectionSet = /* @__PURE__ */ new Set();
g.collectionStack = [];
g.promises = [];
const G = Symbol.for("@motion-canvas/core/signals/default");
function T(r) {
  return typeof r == "function";
}
function Ie(r, e) {
  return T(r) ? () => e(r()) : e(r);
}
function Q(r) {
  return T(r) ? r() : r;
}
class Z extends g {
  constructor(e, t, s = void 0, i = (h) => h, a = {}) {
    super(s), this.initial = e, this.interpolation = t, this.parser = i, this.tweening = !1, Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    }), Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    }), Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    }), this.initial !== void 0 && (this.current = this.initial, this.markDirty(), T(this.initial) || (this.last = this.parse(this.initial))), this.extensions = {
      getter: this.getter.bind(this),
      setter: this.setter.bind(this),
      tweener: this.tweener.bind(this),
      ...a
    };
  }
  toSignal() {
    return this.invokable;
  }
  parse(e) {
    return this.parser(e);
  }
  set(e) {
    return this.extensions.setter(e), this.owner;
  }
  setter(e) {
    return e === G && (e = this.initial), this.current === e ? this.owner : (this.current = e, this.clearDependencies(), T(e) || (this.last = this.parse(e)), this.markDirty(), this.owner);
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var e;
    if (this.event.isRaised() && T(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (t) {
        $().error({
          ...he(t),
          inspect: (e = this.owner) == null ? void 0 : e.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(e, t, s = Pe, i = this.interpolation) {
    return e === void 0 ? this.get() : t === void 0 ? this.set(e) : this.createQueue(s, i).to(e, t);
  }
  createQueue(e, t) {
    const s = this.get(), i = [], a = B("animation chain", function* () {
      for (; i.length > 0; )
        yield* i.shift();
    });
    return a.to = (h, l, u = e, o = t) => (e = u, t = o, i.push(this.tween(h, l, u, o)), a), a.back = (h, l = e, u = t) => (e = l, t = u, i.push(this.tween(s, h, e, t)), a), a.wait = (h) => (i.push(z(h)), a), a.run = (h) => (i.push(h), a), a.do = (h) => (i.push(B(function* () {
      h();
    })), a), a;
  }
  *tween(e, t, s, i) {
    e === G && (e = this.initial), this.tweening = !0, yield* this.extensions.tweener(e, t, s, i), this.set(e), this.tweening = !1;
  }
  *tweener(e, t, s, i) {
    const a = this.get();
    yield* J(t, (h) => {
      this.set(i(a, this.parse(Q(e)), s(h)));
    });
  }
  dispose() {
    super.dispose(), this.initial = void 0, this.current = void 0, this.last = void 0;
  }
  /**
   * Reset the signal to its initial value (if one has been set).
   *
   * @example
   * ```ts
   * const signal = createSignal(7);
   *
   * signal.reset();
   * // same as:
   * signal(7);
   * ```
   */
  reset() {
    return this.initial !== void 0 && this.set(this.initial), this.owner;
  }
  /**
   * Compute the current value of the signal and immediately set it.
   *
   * @remarks
   * This method can be used to stop the signal from updating while keeping its
   * current value.
   *
   * @example
   * ```ts
   * signal.save();
   * // same as:
   * signal(signal());
   * ```
   */
  save() {
    return this.set(this.get());
  }
  /**
   * Check if the signal is currently using its initial value.
   *
   * @example
   * ```ts
   *
   * const signal = createSignal(0);
   * signal.isInitial(); // true
   *
   * signal(5);
   * signal.isInitial(); // false
   *
   * signal(DEFAULT);
   * signal.isInitial(); // true
   * ```
   */
  isInitial() {
    return this.collect(), this.current === this.initial;
  }
  /**
   * Get the initial value of this signal.
   */
  getInitial() {
    return this.initial;
  }
  /**
   * Get the raw value of this signal.
   *
   * @remarks
   * If the signal was provided with a factory function, the function itself
   * will be returned, without invoking it.
   *
   * This method can be used to create copies of signals.
   *
   * @example
   * ```ts
   * const a = createSignal(2);
   * const b = createSignal(() => a);
   * // b() == 2
   *
   * const bClone = createSignal(b.raw());
   * // bClone() == 2
   *
   * a(4);
   * // b() == 4
   * // bClone() == 4
   * ```
   */
  raw() {
    return this.current;
  }
  /**
   * Is the signal undergoing a tween?
   */
  isTweening() {
    return this.tweening;
  }
}
class Re extends Z {
  constructor(e, t, s, i, a = void 0, h = {}) {
    var l;
    super(void 0, i, a, t, h), this.entries = e, this.signals = [], this.parser = t;
    for (const u of e) {
      let o, c;
      Array.isArray(u) ? ([o, c] = u, (l = c.context).owner ?? (l.owner = this)) : (o = u, c = new Z(Ie(s, (p) => t(p)[u]), v, a ?? this.invokable).toSignal()), this.signals.push([o, c]), Object.defineProperty(this.invokable, o, { value: c });
    }
  }
  toSignal() {
    return this.invokable;
  }
  parse(e) {
    return this.parser(e);
  }
  getter() {
    return this.parse(Object.fromEntries(this.signals.map(([e, t]) => [e, t()])));
  }
  setter(e) {
    if (T(e))
      for (const [t, s] of this.signals)
        s(() => this.parser(e())[t]);
    else {
      const t = this.parse(e);
      for (const [s, i] of this.signals)
        i(t[s]);
    }
    return this.owner;
  }
  reset() {
    for (const [, e] of this.signals)
      e.reset();
    return this.owner;
  }
  save() {
    for (const [, e] of this.signals)
      e.save();
    return this.owner;
  }
  isInitial() {
    for (const [, e] of this.signals)
      if (!e.isInitial())
        return !1;
    return !0;
  }
  raw() {
    return Object.fromEntries(this.signals.map(([e, t]) => [e, t.context.raw()]));
  }
}
class Ee extends Re {
  constructor(e, t, s, i, a = void 0, h = {}) {
    super(e, t, s, i, a, h), Object.defineProperty(this.invokable, "edit", {
      value: this.edit.bind(this)
    }), Object.defineProperty(this.invokable, "mul", {
      value: this.mul.bind(this)
    }), Object.defineProperty(this.invokable, "div", {
      value: this.div.bind(this)
    }), Object.defineProperty(this.invokable, "add", {
      value: this.add.bind(this)
    }), Object.defineProperty(this.invokable, "sub", {
      value: this.sub.bind(this)
    }), Object.defineProperty(this.invokable, "dot", {
      value: this.dot.bind(this)
    }), Object.defineProperty(this.invokable, "cross", {
      value: this.cross.bind(this)
    }), Object.defineProperty(this.invokable, "mod", {
      value: this.mod.bind(this)
    });
  }
  toSignal() {
    return this.invokable;
  }
  edit(e, t, s, i) {
    const a = e(this.get());
    return this.invoke(a, t, s, i);
  }
  mul(e, t, s, i) {
    const a = (h) => h.mul(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  div(e, t, s, i) {
    const a = (h) => h.div(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  add(e, t, s, i) {
    const a = (h) => h.add(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  sub(e, t, s, i) {
    const a = (h) => h.sub(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  dot(e, t, s, i) {
    const a = (h) => h.dot(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  cross(e, t, s, i) {
    const a = (h) => h.cross(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
  mod(e, t, s, i) {
    const a = (h) => h.mod(e);
    return t === void 0 ? this.edit(a) : this.edit(a, t, s, i);
  }
}
const K = 1e-6;
class f {
  static fromRotation(e) {
    return f.identity.rotate(e);
  }
  static fromTranslation(e) {
    return f.identity.translate(new n(e));
  }
  static fromScaling(e) {
    return f.identity.scale(new n(e));
  }
  get x() {
    return new n(this.values[0], this.values[1]);
  }
  get y() {
    return new n(this.values[2], this.values[3]);
  }
  get scaleX() {
    return this.values[0];
  }
  set scaleX(e) {
    this.values[0] = this.x.normalized.scale(e).x;
  }
  get skewX() {
    return this.values[1];
  }
  set skewX(e) {
    this.values[1] = e;
  }
  get scaleY() {
    return this.values[3];
  }
  set scaleY(e) {
    this.values[3] = this.y.normalized.scale(e).y;
  }
  get skewY() {
    return this.values[2];
  }
  set skewY(e) {
    this.values[2] = e;
  }
  get translateX() {
    return this.values[4];
  }
  set translateX(e) {
    this.values[4] = e;
  }
  get translateY() {
    return this.values[5];
  }
  set translateY(e) {
    this.values[5] = e;
  }
  get rotation() {
    return n.degrees(this.values[0], this.values[1]);
  }
  set rotation(e) {
    const t = this.rotate(e - this.rotation);
    this.values[0] = t.values[0], this.values[1] = t.values[1], this.values[2] = t.values[2], this.values[3] = t.values[3];
  }
  get translation() {
    return new n(this.values[4], this.values[5]);
  }
  set translation(e) {
    const t = new n(e);
    this.values[4] = t.x, this.values[5] = t.y;
  }
  get scaling() {
    return new n(this.values[0], this.values[3]);
  }
  set scaling(e) {
    const t = new n(e), s = new n(this.values[0], this.values[1]).normalized, i = new n(this.values[2], this.values[3]).normalized;
    this.values[0] = s.x * t.x, this.values[1] = s.y * t.y, this.values[2] = i.x * t.x, this.values[3] = i.y * t.y;
  }
  /**
   * Get the inverse of the matrix.
   *
   * @remarks
   * If the matrix is not invertible, i.e. its determinant is `0`, this will
   * return `null`, instead.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const inverse = matrix.inverse;
   * // => Matrix2D(
   * //      [-2, 1],
   * //      [1.5, -0.5],
   * //      [1, -2],
   * //   )
   * ```
   */
  get inverse() {
    const e = this.values[0], t = this.values[1], s = this.values[2], i = this.values[3], a = this.values[4], h = this.values[5];
    let l = e * i - t * s;
    return l ? (l = 1 / l, new f(i * l, -t * l, -s * l, e * l, (s * h - i * a) * l, (t * a - e * h) * l)) : null;
  }
  /**
   * Get the determinant of the matrix.
   */
  get determinant() {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2];
  }
  get domMatrix() {
    return new DOMMatrix([
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[4],
      this.values[5]
    ]);
  }
  constructor(e, t, s, i, a, h) {
    if (this.values = new Float32Array(6), arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      this.values[0] = e, this.values[1] = t, this.values[2] = s, this.values[3] = i, this.values[4] = a, this.values[5] = h;
      return;
    }
    if (e instanceof DOMMatrix) {
      this.values[0] = e.m11, this.values[1] = e.m12, this.values[2] = e.m21, this.values[3] = e.m22, this.values[4] = e.m41, this.values[5] = e.m42;
      return;
    }
    if (e instanceof f) {
      this.values = e.values;
      return;
    }
    if (Array.isArray(e)) {
      if (e.length === 2) {
        this.values[0] = e[0], this.values[1] = e[1], this.values[2] = t[0], this.values[3] = t[1], this.values[4] = s[0], this.values[5] = s[1];
        return;
      }
      if (e.length === 3) {
        const c = new n(e[0]), p = new n(e[1]), m = new n(e[2]);
        this.values[0] = c.x, this.values[1] = c.y, this.values[2] = p.x, this.values[3] = p.y, this.values[4] = m.x, this.values[5] = m.y;
        return;
      }
      this.values[0] = e[0], this.values[1] = e[1], this.values[2] = e[2], this.values[3] = e[3], this.values[4] = e[4], this.values[5] = e[5];
      return;
    }
    const l = new n(e), u = new n(t), o = new n(s);
    this.values[0] = l.x, this.values[1] = l.y, this.values[2] = u.x, this.values[3] = u.y, this.values[4] = o.x, this.values[5] = o.y;
  }
  /**
   * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const x = matrix.column(0);
   * // Vector2(1, 0)
   *
   * const y = matrix.column(1);
   * // Vector2(0, 0)
   *
   * const z = matrix.column(1);
   * // Vector2(1, 0)
   * ```
   *
   * @param index - The index of the component vector to retrieve.
   */
  column(e) {
    return new n(this.values[e * 2], this.values[e * 2 + 1]);
  }
  /**
   * Returns the nth row of the matrix. Only defined for 0 and 1.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const firstRow = matrix.column(0);
   * // [1, 0, 1]
   *
   * const secondRow = matrix.column(1);
   * // [0, 0, 0]
   * ```
   *
   * @param index - The index of the row to retrieve.
   */
  row(e) {
    return [this.values[e], this.values[e + 2], this.values[e + 4]];
  }
  /**
   * Returns the matrix product of this matrix with the provided matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [0, 1],
   *   [1, 1],
   * );
   * const b = new Matrix2D(
   *   [2, 1],
   *   [1, 1],
   *   [1, 1],
   * );
   *
   * const result = a.mul(b);
   * // => Matrix2D(
   * //     [2, 5],
   * //     [1, 3],
   * //     [2, 4],
   * //   )
   * ```
   *
   * @param other - The matrix to multiply with
   */
  mul(e) {
    const t = this.values[0], s = this.values[1], i = this.values[2], a = this.values[3], h = this.values[4], l = this.values[5], u = e.values[0], o = e.values[1], c = e.values[2], p = e.values[3], m = e.values[4], P = e.values[5];
    return new f(t * u + i * o, s * u + a * o, t * c + i * p, s * c + a * p, t * m + i * P + h, s * m + a * P + l);
  }
  /**
   * Rotate the matrix by the provided angle. By default, the angle is
   * provided in degrees.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result = a.rotate(90);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   *
   * // Provide the angle in radians
   * const result = a.rotate(Math.PI * 0.5, true);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   * ```
   *
   * @param angle - The angle by which to rotate the matrix.
   * @param degrees - Whether the angle is provided in degrees.
   */
  rotate(e, t = !0) {
    t && (e *= L);
    const s = this.values[0], i = this.values[1], a = this.values[2], h = this.values[3], l = this.values[4], u = this.values[5], o = Math.sin(e), c = Math.cos(e);
    return new f(s * c + a * o, i * c + h * o, s * -o + a * c, i * -o + h * c, l, u);
  }
  /**
   * Scale the x and y component vectors of the matrix.
   *
   * @remarks
   * If `vec` is provided as a vector, the x and y component vectors of the
   * matrix will be scaled by the x and y parts of the vector, respectively.
   *
   * If `vec` is provided as a scalar, the x and y component vectors will be
   * scaled uniformly by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.scale([2, 3]);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [9, 12],
   * //      [5, 6],
   * //    )
   *
   * const result2 = matrix.scale(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [5, 6],
   * //    )
   * ```
   *
   * @param vec - The factor by which to scale the matrix
   */
  scale(e) {
    const t = new n(e);
    return new f(this.values[0] * t.x, this.values[1] * t.x, this.values[2] * t.y, this.values[3] * t.y, this.values[4], this.values[5]);
  }
  /**
   * Multiply each value of the matrix by a scalar.
   *
   * * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.mulScalar(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [10, 12],
   * //    )
   * ```
   *
   * @param s - The value by which to scale each term
   */
  mulScalar(e) {
    return new f(this.values[0] * e, this.values[1] * e, this.values[2] * e, this.values[3] * e, this.values[4] * e, this.values[5] * e);
  }
  /**
   * Translate the matrix by the dimensions of the provided vector.
   *
   * @remarks
   * If `vec` is provided as a scalar, matrix will be translated uniformly
   * by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.translate([2, 3]);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [16, 22],
   * //    )
   *
   * const result2 = matrix.translate(2);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [13, 18],
   * //    )
   * ```
   *
   * @param vec - The vector by which to translate the matrix
   */
  translate(e) {
    const t = new n(e);
    return new f(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * t.x + this.values[2] * t.y + this.values[4], this.values[1] * t.x + this.values[3] * t.y + this.values[5]);
  }
  /**
   * Add the provided matrix to this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.add(b);
   * // => Matrix2D(
   * //      [8, 10],
   * //      [12, 14],
   * //      [16, 18],
   * //    )
   * ```
   *
   * @param other - The matrix to add
   */
  add(e) {
    return new f(this.values[0] + e.values[0], this.values[1] + e.values[1], this.values[2] + e.values[2], this.values[3] + e.values[3], this.values[4] + e.values[4], this.values[5] + e.values[5]);
  }
  /**
   * Subtract the provided matrix from this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.sub(b);
   * // => Matrix2D(
   * //      [-6, -6],
   * //      [-6, -6],
   * //      [-6, -6],
   * //    )
   * ```
   *
   * @param other - The matrix to subract
   */
  sub(e) {
    return new f(this.values[0] - e.values[0], this.values[1] - e.values[1], this.values[2] - e.values[2], this.values[3] - e.values[3], this.values[4] - e.values[4], this.values[5] - e.values[5]);
  }
  toSymbol() {
    return f.symbol;
  }
  toUniform(e, t) {
    e.uniformMatrix3fv(t, !1, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1
    ]);
  }
  equals(e, t = K) {
    return Math.abs(this.values[0] - e.values[0]) <= t + Number.EPSILON && Math.abs(this.values[1] - e.values[1]) <= t + Number.EPSILON && Math.abs(this.values[2] - e.values[2]) <= t + Number.EPSILON && Math.abs(this.values[3] - e.values[3]) <= t + Number.EPSILON && Math.abs(this.values[4] - e.values[4]) <= t + Number.EPSILON && Math.abs(this.values[5] - e.values[5]) <= t + Number.EPSILON;
  }
  exactlyEquals(e) {
    return this.values[0] === e.values[0] && this.values[1] === e.values[1] && this.values[2] === e.values[2] && this.values[3] === e.values[3] && this.values[4] === e.values[4] && this.values[5] === e.values[5];
  }
}
f.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
f.identity = new f(1, 0, 0, 1, 0, 0);
f.zero = new f(0, 0, 0, 0, 0, 0);
var W;
(function(r) {
  r[r.Vertical = 1] = "Vertical", r[r.Horizontal = 2] = "Horizontal";
})(W || (W = {}));
var k;
(function(r) {
  r[r.Top = 4] = "Top", r[r.Bottom = 8] = "Bottom", r[r.Left = 16] = "Left", r[r.Right = 32] = "Right";
})(k || (k = {}));
var A;
(function(r) {
  r[r.Middle = 3] = "Middle", r[r.Top = 5] = "Top", r[r.Bottom = 9] = "Bottom", r[r.Left = 18] = "Left", r[r.Right = 34] = "Right", r[r.TopLeft = 20] = "TopLeft", r[r.TopRight = 36] = "TopRight", r[r.BottomLeft = 24] = "BottomLeft", r[r.BottomRight = 40] = "BottomRight";
})(A || (A = {}));
class n {
  static createSignal(e, t = n.lerp, s) {
    return new Ee(["x", "y"], (i) => new n(i), e, t, s).toSignal();
  }
  static lerp(e, t, s) {
    let i, a;
    return typeof s == "number" ? i = a = s : (i = s.x, a = s.y), new n(v(e.x, t.x, i), v(e.y, t.y, a));
  }
  static arcLerp(e, t, s, i = !1, a) {
    return a ?? (a = e.sub(t).ctg), n.lerp(e, t, Te(s, i, a));
  }
  static createArcLerp(e, t) {
    return (s, i, a) => n.arcLerp(s, i, a, e, t);
  }
  /**
   * Interpolates between two vectors on the polar plane by interpolating
   * the angles and magnitudes of the vectors individually.
   *
   * @param from - The starting vector.
   * @param to - The target vector.
   * @param value - The t-value of the interpolation.
   * @param counterclockwise - Whether the vector should get rotated
   *                           counterclockwise. Defaults to `false`.
   * @param origin - The center of rotation. Defaults to the origin.
   *
   * @remarks
   * This function is useful when used in conjunction with {@link rotate} to
   * animate an object's position on a circular arc (see examples).
   *
   * @example
   * Animating an object in a circle around the origin
   * ```tsx
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.polarLerp
   * );
   * ```
   * @example
   * Rotating an object around the point `[-200, 100]`
   * ```ts
   * circle().position(
   *   circle().position().rotate(180, [-200, 100]),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(false, [-200, 100]),
   * );
   * ```
   * @example
   * Rotating an object counterclockwise around the origin
   * ```ts
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(true),
   * );
   * ```
   */
  static polarLerp(e, t, s, i = !1, a = n.zero) {
    e = e.sub(a), t = t.sub(a);
    const h = e.degrees;
    let l = t.degrees;
    h > l !== i && (l = l + (i ? -360 : 360));
    const o = v(h, l, s) * L, c = v(e.magnitude, t.magnitude, s);
    return new n(c * Math.cos(o) + a.x, c * Math.sin(o) + a.y);
  }
  /**
   * Helper function to create a {@link Vector2.polarLerp} interpolation
   * function with additional parameters.
   *
   * @param counterclockwise - Whether the point should get rotated
   *                           counterclockwise.
   * @param center - The center of rotation. Defaults to the origin.
   */
  static createPolarLerp(e = !1, t = n.zero) {
    return (s, i, a) => n.polarLerp(s, i, a, e, new n(t));
  }
  static fromOrigin(e) {
    const t = new n();
    return e === A.Middle || (e & k.Left ? t.x = -1 : e & k.Right && (t.x = 1), e & k.Top ? t.y = -1 : e & k.Bottom && (t.y = 1)), t;
  }
  static fromScalar(e) {
    return new n(e, e);
  }
  static fromRadians(e) {
    return new n(Math.cos(e), Math.sin(e));
  }
  static fromDegrees(e) {
    return n.fromRadians(e * L);
  }
  /**
   * Return the angle in radians between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  static radians(e, t) {
    return Math.atan2(t, e);
  }
  /**
   * Return the angle in degrees between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  static degrees(e, t) {
    return n.radians(e, t) * ve;
  }
  static magnitude(e, t) {
    return Math.sqrt(e * e + t * t);
  }
  static squaredMagnitude(e, t) {
    return e * e + t * t;
  }
  static angleBetween(e, t) {
    return Math.acos(R(-1, 1, e.dot(t) / (e.magnitude * t.magnitude))) * (e.cross(t) >= 0 ? 1 : -1);
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  get magnitude() {
    return n.magnitude(this.x, this.y);
  }
  get squaredMagnitude() {
    return n.squaredMagnitude(this.x, this.y);
  }
  get normalized() {
    return this.scale(1 / n.magnitude(this.x, this.y));
  }
  get safe() {
    return new n(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }
  get flipped() {
    return new n(-this.x, -this.y);
  }
  get floored() {
    return new n(Math.floor(this.x), Math.floor(this.y));
  }
  get rounded() {
    return new n(Math.round(this.x), Math.round(this.y));
  }
  get ceiled() {
    return new n(Math.ceil(this.x), Math.ceil(this.y));
  }
  get perpendicular() {
    return new n(this.y, -this.x);
  }
  /**
   * Return the angle in radians between the vector and the positive x-axis.
   */
  get radians() {
    return n.radians(this.x, this.y);
  }
  /**
   * Return the angle in degrees between the vector and the positive x-axis.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  get degrees() {
    return n.degrees(this.x, this.y);
  }
  get ctg() {
    return this.x / this.y;
  }
  constructor(e, t) {
    if (this.x = 0, this.y = 0, e != null) {
      if (typeof e != "object") {
        this.x = e, this.y = t ?? e;
        return;
      }
      if (Array.isArray(e)) {
        this.x = e[0], this.y = e[1];
        return;
      }
      if ("width" in e) {
        this.x = e.width, this.y = e.height;
        return;
      }
      this.x = e.x, this.y = e.y;
    }
  }
  lerp(e, t) {
    return n.lerp(this, e, t);
  }
  getOriginOffset(e) {
    const t = n.fromOrigin(e);
    return t.x *= this.x / 2, t.y *= this.y / 2, t;
  }
  scale(e) {
    return new n(this.x * e, this.y * e);
  }
  transformAsPoint(e) {
    const t = new f(e);
    return new n(this.x * t.scaleX + this.y * t.skewY + t.translateX, this.x * t.skewX + this.y * t.scaleY + t.translateY);
  }
  transform(e) {
    const t = new f(e);
    return new n(this.x * t.scaleX + this.y * t.skewY, this.x * t.skewX + this.y * t.scaleY);
  }
  mul(e) {
    const t = new n(e);
    return new n(this.x * t.x, this.y * t.y);
  }
  div(e) {
    const t = new n(e);
    return new n(this.x / t.x, this.y / t.y);
  }
  add(e) {
    const t = new n(e);
    return new n(this.x + t.x, this.y + t.y);
  }
  sub(e) {
    const t = new n(e);
    return new n(this.x - t.x, this.y - t.y);
  }
  dot(e) {
    const t = new n(e);
    return this.x * t.x + this.y * t.y;
  }
  cross(e) {
    const t = new n(e);
    return this.x * t.y - this.y * t.x;
  }
  mod(e) {
    const t = new n(e);
    return new n(this.x % t.x, this.y % t.y);
  }
  /**
   * Rotate the vector around a point by the provided angle.
   *
   * @param angle - The angle by which to rotate in degrees.
   * @param center - The center of rotation. Defaults to the origin.
   */
  rotate(e, t = n.zero) {
    const s = new n(t), i = f.fromTranslation(s).rotate(e).translate(s.flipped);
    return this.transformAsPoint(i);
  }
  addX(e) {
    return new n(this.x + e, this.y);
  }
  addY(e) {
    return new n(this.x, this.y + e);
  }
  /**
   * Transform the components of the vector.
   *
   * @example
   * Raise the components to the power of 2.
   * ```ts
   * const vector = new Vector2(2, 3);
   * const result = vector.transform(value => value ** 2);
   * ```
   *
   * @param callback - A callback to apply to each component.
   */
  map(e) {
    return new n(e(this.x, 0), e(this.y, 1));
  }
  toSymbol() {
    return n.symbol;
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  toArray() {
    return [this.x, this.y];
  }
  toUniform(e, t) {
    e.uniform2f(t, this.x, this.y);
  }
  serialize() {
    return { x: this.x, y: this.y };
  }
  /**
   * Check if two vectors are exactly equal to each other.
   *
   * @remarks
   * If you need to compensate for floating point inaccuracies, use the
   * {@link equals} method, instead.
   *
   * @param other - The vector to compare.
   */
  exactlyEquals(e) {
    return this.x === e.x && this.y === e.y;
  }
  /**
   * Check if two vectors are equal to each other.
   *
   * @remarks
   * This method allows passing an allowed error margin when comparing vectors
   * to compensate for floating point inaccuracies. To check if two vectors are
   * exactly equal, use the {@link exactlyEquals} method, instead.
   *
   * @param other - The vector to compare.
   * @param threshold - The allowed error threshold when comparing the vectors.
   */
  equals(e, t = K) {
    return Math.abs(this.x - e.x) <= t + Number.EPSILON && Math.abs(this.y - e.y) <= t + Number.EPSILON;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
n.symbol = Symbol.for("@motion-canvas/core/types/Vector2");
n.zero = new n();
n.one = new n(1, 1);
n.right = new n(1, 0);
n.left = new n(-1, 0);
n.up = new n(0, 1);
n.down = new n(0, -1);
n.top = new n(0, -1);
n.bottom = new n(0, 1);
n.topLeft = new n(-1, -1);
n.topRight = new n(1, -1);
n.bottomLeft = new n(-1, 1);
n.bottomRight = new n(1, 1);
const Me = '@import"https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";body{margin:0;padding:0}.initial{display:none}.state-initial .initial{display:block}.loading{display:none}.state-loading .loading{display:block}.ready{display:none}.state-ready .ready{display:block}.error{display:none}.state-error .error{display:block}:host{position:relative;display:block}.overlay{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;opacity:0;background-color:#0000008a;transition:opacity .1s}.overlay.state-ready:not(.auto){cursor:pointer}.overlay.state-loading,.overlay.state-error{opacity:1;transition:opacity 1s}.overlay.state-ready.auto{opacity:0}.button{width:50%;max-width:96px;aspect-ratio:1;scale:.5;transition:scale .1s ease-in,opacity .1s;background-color:transparent;border:none;background-size:100% 100%;background-repeat:no-repeat;opacity:.54;cursor:inherit;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE0LjV2LTlsNiA0LjUtNiA0LjV6Ii8+PC9zdmc+)}.playing .button{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNmZmZmZmYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zy8+PHBhdGggZD0iTTEyLDJDNi40OCwyLDIsNi40OCwyLDEyczQuNDgsMTAsMTAsMTBzMTAtNC40OCwxMC0xMFMxNy41MiwyLDEyLDJ6IE0xMSwxNkg5VjhoMlYxNnogTTE1LDE2aC0yVjhoMlYxNnoiLz48L2c+PC9zdmc+)}.auto .button{display:none}.canvas{width:100%;display:block;opacity:0;transition:opacity .1s}.canvas.state-ready{opacity:1}.message{font-family:JetBrains Mono,sans-serif;text-align:center;font-size:20px;padding:8px 16px;margin:16px;border-radius:4px;color:#fff9;background-color:#000000de}.loader{width:50%;max-width:96px;display:none;rotate:-90deg;animation:stroke 2s cubic-bezier(.5,0,.5,1) infinite,rotate 2s linear infinite}@keyframes stroke{0%{stroke-dasharray:5.6548667765px 50.8938009883px;stroke-dashoffset:2.8274333882px}50%{stroke-dasharray:50.8938009883px 5.6548667765px;stroke-dashoffset:-2.8274333882px}to{stroke-dasharray:5.6548667765px 50.8938009883px;stroke-dashoffset:-53.7212343766px}}@keyframes rotate{0%{rotate:-110deg}to{rotate:250deg}}.btn-list{position:absolute;display:flex;width:100%;height:100%;top:0;left:0;justify-content:center;align-items:center}.btn-prev{background-color:#ffffff10;flex:1;height:100%;border:none;color:#fff}.btn-next{background-color:#ffffff10;flex:2;height:100%;border:none;color:#fff}', Ce = `<div class="overlay" part="overlay">
  <button
    part="play-button"
    title="Play / Pause"
    class="button ready"
    tabindex="0"
  ></button>

  <div part="message" class="message error">
    An error occurred while loading the animation.
  </div>
  <svg
    part="loader"
    class="loader loading"
    viewBox="0 0 24 24"
    stroke="#ffffff"
    stroke-width="2"
    fill="transparent"
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
</div>
`, Le = `<style>${Me}</style>${Ce}`, H = "motion-canvas-player";
class Ae extends HTMLElement {
  constructor() {
    super();
    d(this, "root");
    d(this, "canvas");
    d(this, "overlay");
    d(this, "button");
    d(this, "state", "initial");
    d(this, "project", null);
    d(this, "player", null);
    d(this, "defaultSettings");
    d(this, "abortController", null);
    d(this, "mouseMoveId", null);
    d(this, "finished", !1);
    d(this, "playing", !1);
    d(this, "connected", !1);
    d(this, "stage", new ye());
    d(this, "slides", []);
    d(this, "currentSlide", 1);
    d(this, "f", !0);
    d(this, "indicator");
    d(this, "nextButton");
    d(this, "previousButton");
    d(this, "handlePlay", (t) => {
      this.setPlaying(t);
    });
    d(this, "handleMouseMove", () => {
      this.mouseMoveId && clearTimeout(this.mouseMoveId), this.hover && !this.playing && this.handlePlay(!0), this.mouseMoveId = window.setTimeout(() => {
        this.mouseMoveId = null, this.updateClass();
      }, 2e3), this.updateClass();
    });
    d(this, "handlePrevious", () => {
      this.currentSlide = this.currentSlide - 1, !this.auto && this.player && this.player.requestSeek(this.slides[this.currentSlide].time * 60);
    });
    d(this, "handleClick", () => {
      this.auto || (this.handleMouseMove(), this.handlePlay(!0), this.currentSlide++);
    });
    d(this, "render", async () => {
      this.player && (this.slides.length === 0 && (this.slides = this.player.playback.currentScene.playback.playback.slides), this.f && (this.handlePrevious(), this.f = !1), await this.stage.render(
        this.player.playback.currentScene,
        this.player.playback.previousScene
      ));
    });
    this.root = this.attachShadow({ mode: "open" }), this.root.innerHTML = Le, this.overlay = this.root.querySelector(".overlay"), this.button = this.root.querySelector(".button"), this.canvas = this.stage.finalBuffer, this.canvas.classList.add("canvas"), this.root.prepend(this.canvas), this.indicator = document.querySelector("#indicator"), this.nextButton = document.querySelector("#next"), this.nextButton.addEventListener("click", this.handleClick), this.previousButton = document.querySelector("#previous"), this.previousButton.addEventListener("click", this.handlePrevious), this.setState(
      "initial"
      /* Initial */
    );
  }
  static get observedAttributes() {
    return ["src", "quality", "width", "height", "auto", "variables"];
  }
  get auto() {
    return !!this.getAttribute("auto");
  }
  get hover() {
    return this.getAttribute("auto") === "hover";
  }
  get quality() {
    const t = this.getAttribute("quality");
    return t ? parseFloat(t) : this.defaultSettings.resolutionScale;
  }
  get width() {
    const t = this.getAttribute("width");
    return t ? parseFloat(t) : this.defaultSettings.size.width;
  }
  get height() {
    const t = this.getAttribute("height");
    return t ? parseFloat(t) : this.defaultSettings.size.height;
  }
  get variables() {
    try {
      const t = this.getAttribute("variables");
      return t ? JSON.parse(t) : {};
    } catch {
      return this.project.logger.warn("Project variables could not be parsed."), {};
    }
  }
  setState(t) {
    this.state = t, this.handlePlay(this.playing);
  }
  setPlaying(t) {
    var s, i;
    this.state === "ready" && (t || this.auto && !this.hover) ? ((s = this.player) == null || s.togglePlayback(!0), this.playing = !0) : ((i = this.player) == null || i.togglePlayback(!1), this.playing = !1), this.updateClass();
  }
  updateClass() {
    this.overlay.className = `overlay state-${this.state}`, this.canvas.className = `canvas state-${this.state}`, this.overlay.classList.toggle("playing", this.playing), this.overlay.classList.toggle("auto", this.auto), this.overlay.classList.toggle("hover", this.mouseMoveId !== null), this.connected && (this.mouseMoveId !== null || !this.playing ? this.dataset.overlay = "" : delete this.dataset.overlay);
  }
  async updateSource(t) {
    var a, h, l, u;
    this.setState(
      "initial"
      /* Initial */
    ), (a = this.abortController) == null || a.abort(), this.abortController = new AbortController();
    let s;
    try {
      const o = import(
        /* webpackIgnore: true */
        /* @vite-ignore */
        t
      ), c = new Promise((p) => setTimeout(p, 200));
      await Promise.any([c, o]), this.setState(
        "loading"
        /* Loading */
      ), s = (await o).default;
    } catch (o) {
      console.error(o), this.setState(
        "error"
        /* Error */
      );
      return;
    }
    this.defaultSettings = s.meta.getFullRenderingSettings();
    const i = new me(s);
    i.setVariables(this.variables), this.finished = !1, (h = this.player) == null || h.onRender.unsubscribe(this.render), (l = this.player) == null || l.togglePlayback(!1), (u = this.player) == null || u.deactivate(), this.project = s, this.player = i, this.updateSettings(), this.player.onRender.subscribe(this.render), this.player.togglePlayback(this.playing), this.setState(
      "ready"
      /* Ready */
    );
  }
  attributeChangedCallback(t, s, i) {
    var a;
    switch (t) {
      case "auto":
        this.handlePlay(this.playing);
        break;
      case "src":
        this.updateSource(i);
        break;
      case "quality":
      case "width":
      case "height":
        this.updateSettings();
        break;
      case "variables":
        (a = this.player) == null || a.setVariables(this.variables);
    }
  }
  disconnectedCallback() {
    var t, s;
    this.connected = !1, (t = this.player) == null || t.deactivate(), (s = this.player) == null || s.onRender.unsubscribe(this.render);
  }
  connectedCallback() {
    var t, s;
    this.connected = !0, (t = this.player) == null || t.activate(), (s = this.player) == null || s.onRender.subscribe(this.render);
  }
  updateSettings() {
    this.player && this.player.requestSeek(0);
    const t = {
      ...this.defaultSettings,
      size: new n(this.width, this.height),
      resolutionScale: this.quality
    };
    this.stage.configure(t), this.player.configure(t);
  }
}
customElements.get(H) || customElements.define(H, Ae);
