class Zn {
  constructor() {
    (this.subscribable = new Hi(this)), (this.subscribers = new Set());
  }
  subscribe(t) {
    return this.subscribers.add(t), () => this.unsubscribe(t);
  }
  unsubscribe(t) {
    this.subscribers.delete(t);
  }
  clear() {
    this.subscribers.clear();
  }
  notifySubscribers(t) {
    return [...this.subscribers].map((e) => e(t));
  }
}
class Hi {
  constructor(t) {
    this.dispatcher = t;
  }
  subscribe(t) {
    return this.dispatcher.subscribe(t);
  }
  unsubscribe(t) {
    this.dispatcher.unsubscribe(t);
  }
}
class qt extends Zn {
  dispatch(t) {
    this.notifySubscribers(t);
  }
}
class bc extends Zn {
  constructor() {
    super(...arguments), (this.value = !1);
  }
  raise() {
    this.value || ((this.value = !0), this.notifySubscribers());
  }
  reset() {
    this.value = !1;
  }
  isRaised() {
    return this.value;
  }
  subscribe(t) {
    const e = super.subscribe(t);
    return this.value && t(), e;
  }
}
class ge extends Zn {
  get current() {
    return this.value;
  }
  set current(t) {
    (this.value = t), this.notifySubscribers(t);
  }
  constructor(t) {
    super(), (this.value = t), (this.subscribable = new wc(this));
  }
  subscribe(t, e = !0) {
    const r = super.subscribe(t);
    return e && t(this.value), r;
  }
}
class wc extends Hi {
  get current() {
    return this.dispatcher.current;
  }
  subscribe(t, e = !0) {
    return this.dispatcher.subscribe(t, e);
  }
}
class Ot {
  get onChanged() {
    return this.value.subscribable;
  }
  get onDisabled() {
    return this.disabled.subscribable;
  }
  constructor(t, e) {
    (this.name = t),
      (this.initial = e),
      (this.type = void 0),
      (this.spacing = !1),
      (this.description = ""),
      (this.disabled = new ge(!1)),
      (this.value = new ge(e));
  }
  get() {
    return this.value.current;
  }
  set(t) {
    this.value.current = this.parse(t);
  }
  parse(t) {
    return t;
  }
  serialize() {
    return this.value.current;
  }
  clone() {
    return new this.constructor(this.name, this.get());
  }
  disable(t = !0) {
    return (this.disabled.current = t), this;
  }
  space(t = !0) {
    return (this.spacing = t), this;
  }
  describe(t) {
    return (this.description = t), this;
  }
}
class xc extends Ot {
  get onFieldsChanged() {
    return this.event.subscribable;
  }
  constructor(t, e) {
    const r = new Map(Object.entries(e));
    super(t, Object.fromEntries(Array.from(r, ([i, a]) => [i, a.get()]))),
      (this.type = Object),
      (this.ignoreChange = !1),
      (this.customFields = {}),
      (this.handleChange = () => {
        this.ignoreChange ||
          (this.value.current = {
            ...this.transform("get"),
            ...this.customFields,
          });
      }),
      (this.event = new ge([...r.values()])),
      (this.fields = r);
    for (const [i, a] of this.fields)
      Object.defineProperty(this, i, { value: a }),
        a.onChanged.subscribe(this.handleChange);
  }
  set(t) {
    this.ignoreChange = !0;
    for (const [e, r] of Object.entries(t)) {
      const i = this.fields.get(e);
      i ? i.set(r) : (this.customFields[e] = r);
    }
    (this.ignoreChange = !1), this.handleChange();
  }
  serialize() {
    return { ...this.transform("serialize"), ...this.customFields };
  }
  clone() {
    const t = new this.constructor(this.name, this.transform("clone"));
    return t.set(structuredClone(this.customFields)), t;
  }
  transform(t) {
    return Object.fromEntries(Array.from(this.fields, ([r, i]) => [r, i[t]()]));
  }
}
const ne = xc;
class nn extends Ot {
  constructor() {
    super(...arguments), (this.type = Boolean);
  }
  parse(t) {
    return !!t;
  }
}
class Yi extends Error {
  constructor(t, e) {
    typeof t == "string"
      ? (super(t), (this.remarks = e))
      : (super(t.message),
        (this.remarks = t.remarks),
        (this.object = t.object),
        (this.durationMs = t.durationMs),
        (this.inspect = t.inspect));
  }
}
class kc {
  constructor() {
    (this.resolveCurrent = null), (this.current = null);
  }
  async acquire() {
    for (; this.current; ) await this.current;
    this.current = new Promise((t) => {
      this.resolveCurrent = t;
    });
  }
  release() {
    var t;
    (this.current = null),
      (t = this.resolveCurrent) == null || t.call(this),
      (this.resolveCurrent = null);
  }
}
const an = [];
function on() {
  const n = an.at(-1);
  if (!n) throw new Error("The scene is not available in the current context.");
  return n;
}
function Sc(n) {
  an.push(n);
}
function Tc(n) {
  if (an.pop() !== n)
    throw new Error("startScene/endScene were called out of order.");
}
function Tt() {
  var n;
  return ((n = an.at(-1)) == null ? void 0 : n.logger) ?? console;
}
const Vn = [];
function kr() {
  const n = Vn.at(-1);
  if (!n)
    throw new Yi(
      "The thread is not available in the current context.",
      `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`
    );
  return n;
}
function Ii(n) {
  Vn.push(n);
}
function Ei(n) {
  if (Vn.pop() !== n)
    throw new Error("startThread/endThread was called out of order.");
}
function* mt(n) {
  const { slides: t } = on(),
    e = kr();
  for (t.register(n, e.fixed), yield; t.shouldWait(n); ) yield;
}
function Le(n) {
  return n[0].toUpperCase() + n.slice(1);
}
function E() {
  let n;
  return (e) => {
    if (e !== void 0) n = e;
    else return n;
  };
}
function Zi(n) {
  return { message: n.message, stack: n.stack, remarks: n.remarks };
}
const ji = [
    { value: 0.25, text: "0.25x (Quarter)" },
    { value: 0.5, text: "0.5x (Half)" },
    { value: 1, text: "1.0x (Full)" },
    { value: 2, text: "2.0x (Double)" },
  ],
  Cc = [
    { value: "srgb", text: "sRGB" },
    { value: "display-p3", text: "DCI-P3" },
  ],
  _i = [
    { value: 30, text: "30 FPS" },
    { value: 60, text: "60 FPS" },
  ];
var Wt;
(function (n) {
  (n.Error = "error"),
    (n.Warn = "warn"),
    (n.Info = "info"),
    (n.Http = "http"),
    (n.Verbose = "verbose"),
    (n.Debug = "debug"),
    (n.Silly = "silly");
})(Wt || (Wt = {}));
class Pc {
  constructor() {
    (this.logged = new qt()), (this.history = []), (this.profilers = {});
  }
  get onLogged() {
    return this.logged.subscribable;
  }
  log(t) {
    this.logged.dispatch(t), this.history.push(t);
  }
  error(t) {
    this.logLevel(Wt.Error, t);
  }
  warn(t) {
    this.logLevel(Wt.Warn, t);
  }
  info(t) {
    this.logLevel(Wt.Info, t);
  }
  http(t) {
    this.logLevel(Wt.Http, t);
  }
  verbose(t) {
    this.logLevel(Wt.Verbose, t);
  }
  debug(t) {
    this.logLevel(Wt.Debug, t);
  }
  silly(t) {
    this.logLevel(Wt.Silly, t);
  }
  logLevel(t, e) {
    const r = typeof e == "string" ? { message: e } : e;
    (r.level = t), this.log(r);
  }
  profile(t, e) {
    const r = performance.now();
    if (this.profilers[t]) {
      const i = this.profilers[t];
      delete this.profilers[t];
      const a = e ?? { message: t };
      a.level ?? (a.level = Wt.Debug), (a.durationMs = r - i), this.log(a);
      return;
    }
    this.profilers[t] = r;
  }
}
var br;
(function (n) {
  (n[(n.Playing = 0)] = "Playing"),
    (n[(n.Rendering = 1)] = "Rendering"),
    (n[(n.Paused = 2)] = "Paused"),
    (n[(n.Presenting = 3)] = "Presenting");
})(br || (br = {}));
function Rc(n) {
  const t = {
    version: new Ot("version", 1),
    shared: new ne("General", {
      background: new Gn("background", null),
      range: new cn("range", [0, 1 / 0]),
      size: new aa("resolution", new v(1920, 1080)),
      audioOffset: new Wn("audio offset", 0),
    }),
    preview: new ne("Preview", {
      fps: new Wn("frame rate", 30).setPresets(_i).setRange(1),
      resolutionScale: new $e("scale", ji, 1),
    }),
    rendering: new ne("Rendering", {
      fps: new Wn("frame rate", 60).setPresets(_i).setRange(1),
      resolutionScale: new $e("scale", ji, 1),
      colorSpace: new $e("color space", Cc),
      exporter: new hu("exporter", n),
    }),
  };
  return t.shared.audioOffset.disable(!n.audio), t;
}
class Lc extends ne {
  constructor(t) {
    super("project", Rc(t));
  }
  getFullPreviewSettings() {
    return { ...this.shared.get(), ...this.preview.get() };
  }
  getFullRenderingSettings() {
    return { ...this.shared.get(), ...this.rendering.get() };
  }
}
function Mc() {
  return new ne("Application Settings", {
    version: new Ot("version", 1),
    appearance: new ne("Appearance", {
      color: new Gn("accent color", new ve("#33a6ff")).describe(
        "The accent color for the user interface. (Leave empty to use the default color)"
      ),
      font: new nn("legacy font", !1).describe(
        "Use the 'JetBrains Mono' font for the user interface."
      ),
      coordinates: new nn("coordinates", !0).describe(
        "Display mouse coordinates within the preview window."
      ),
    }),
    defaults: new ne("Defaults", {
      background: new Gn("background", null).describe(
        "The default background color used in new projects."
      ),
      size: new aa("resolution", new v(1920, 1080)).describe(
        "The default resolution used in new projects."
      ),
    }),
  });
}
function $c(n) {
  return typeof n == "function" ? n : () => n;
}
function Ac(n, t, e, r, i, a, h = r.logger ?? new Pc()) {
  const u = Mc();
  a.attach(u);
  const g = { name: n, ...r, plugins: e, versions: t, settings: u, logger: h };
  return (
    (g.meta = new Lc(g)),
    g.meta.shared.set(u.defaults.get()),
    g.experimentalFeatures ?? (g.experimentalFeatures = !1),
    i.attach(g.meta),
    g
  );
}
function zc(n, t) {
  return {
    level: Wt.Error,
    message: n,
    remarks:
      (t ?? "") +
      `<p>This feature requires enabling the <code>experimentalFeatures</code> flag in your project
configuration:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">makeProject</span>({
  <span class="hljs-attr">experimentalFeatures</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-comment">// ...</span>
});</code></pre><p><a href='https://motioncanvas.io/docs/experimental' target='_blank'>Learn more</a> about experimental
features.</p>
`,
  };
}
const Oc = 180 / Math.PI,
  Un = Math.PI / 180;
function Di(n, t, e) {
  let r = 0,
    i = n;
  t !== void 0 && ((r = n), (i = t)), (e = e === void 0 ? (r < i ? 1 : -1) : e);
  const a = [];
  let h = Math.max(Math.ceil((i - r) / e), 0),
    u = 0;
  for (; h--; ) (a[u++] = r), (r += e);
  return a;
}
function Fc(n) {
  const t = on(),
    e = kr();
  return t.timeEvents.register(n, e.time());
}
const Jn = [];
function Vi() {
  const n = Jn.at(-1);
  if (!n)
    throw new Error("The playback is not available in the current context.");
  return n;
}
function Ic(n) {
  Jn.push(n);
}
function Ec(n) {
  if (Jn.pop() !== n)
    throw new Error("startPlayback/endPlayback were called out of order.");
}
function ye(n, ...t) {
  const e = { [n.name]: n },
    r = Object.getOwnPropertyDescriptor(e, n.name);
  if (r) for (let i = t.length - 1; i >= 0; i--) t[i](e, n.name, r);
}
const Ni = Symbol.for("@motion-canvas/core/decorators/UNINITIALIZED");
function ln(n) {
  return (t, e) => {
    let r = Ni;
    Object.defineProperty(t, e, {
      get() {
        return r === Ni && (r = n.call(this)), r;
      },
    });
  };
}
function dt(n) {
  return function (t, e, r) {
    (r.value.prototype.name = n ?? e), (r.value.prototype.threadable = !0);
  };
}
ye(B, dt());
function* B(...n) {
  for (const t of n) yield t;
  yield* ta(...n);
}
ye(jc, dt());
function* jc(n, t) {
  yield* wr(Fc(n)), t && (yield* t);
}
ye(wr, dt());
function* wr(n = 0, t) {
  const e = kr(),
    r = Vi().framesToSeconds(1),
    i = e.time() + n;
  for (; i - r > e.fixed; ) yield;
  e.time(i), t && (yield* t);
}
ye(Ji, dt());
function* Ji() {}
function Wi(n, t) {
  let e;
  return (
    typeof n == "string" ? ((e = t()), sn(e, n)) : ((e = n()), sn(e, e)), e
  );
}
function _c(n) {
  return (
    n && (typeof n == "object" || typeof n == "function") && "toPromise" in n
  );
}
function Qi(n) {
  return (
    n !== null && typeof n == "object" && Symbol.iterator in n && "next" in n
  );
}
function sn(n, t) {
  const e = Object.getPrototypeOf(n);
  e.threadable ||
    ((e.threadable = !0), (e.name = typeof t == "string" ? t : Ki(t)));
}
function Ki(n) {
  return Object.getPrototypeOf(n).name ?? null;
}
class Nn {
  get onDeferred() {
    return this.deferred.subscribable;
  }
  get fixed() {
    return this.fixedTime;
  }
  get canceled() {
    var t;
    return (
      this.isCanceled ||
      (((t = this.parent) == null ? void 0 : t.canceled) ?? !1)
    );
  }
  get paused() {
    var t;
    return (
      this.isPaused || (((t = this.parent) == null ? void 0 : t.paused) ?? !1)
    );
  }
  get root() {
    var t;
    return ((t = this.parent) == null ? void 0 : t.root) ?? this;
  }
  constructor(t) {
    (this.runner = t),
      (this.deferred = new qt()),
      (this.children = []),
      (this.time = ze(0)),
      (this.parent = null),
      (this.isCanceled = !1),
      (this.isPaused = !1),
      (this.fixedTime = 0),
      (this.queue = []),
      this.runner.task &&
        (Tt().error({
          message: `The generator "${Ki(
            this.runner
          )}" is already being executed by another thread.`,
          remarks: `<p>This usually happens when you mistakenly reuse a generator that is already
running.</p>
<p>For example, using <code>yield</code> here will run the opacity generator concurrently and
store it in the <code>task</code> variable (in case you want to cancel or await it later):</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">const</span> task = <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>);</code></pre><p>Trying to <code>yield</code> this task again will cause the current error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span> task;</code></pre><p>Passing it to other flow functions will also cause the error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(task);</code></pre><p>Try to investigate your code looking for <code>yield</code> statements whose return value
is reused in this way. Here&#39;s an example of a common mistake:</p>
<pre class="wrong"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre><pre class="correct"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre>`,
        }),
        (this.runner = Ji())),
      (this.runner.task = this);
  }
  next() {
    if (this.paused) return { value: null, done: !1 };
    Ii(this);
    const t = this.runner.next(this.value);
    return Ei(this), (this.value = null), t;
  }
  update(t) {
    this.paused || (this.time(this.time() + t), (this.fixedTime += t)),
      (this.children = this.children.filter((e) => !e.canceled));
  }
  spawn(t) {
    return Qi(t) || (t = t()), this.queue.push(t), t;
  }
  add(t) {
    (t.parent = this),
      (t.isCanceled = !1),
      t.time(this.time()),
      (t.fixedTime = this.fixedTime),
      this.children.push(t),
      sn(t.runner, `unknown ${this.children.length}`);
  }
  drain(t) {
    this.queue.forEach(t), (this.queue = []);
  }
  cancel() {
    this.deferred.clear(),
      this.runner.return(),
      (this.isCanceled = !0),
      (this.parent = null),
      this.drain((t) => t.return());
  }
  pause(t) {
    this.isPaused = t;
  }
  runDeferred() {
    Ii(this), this.deferred.dispatch(), Ei(this);
  }
}
ye(ta, dt());
function* ta(n, ...t) {
  let e = !0;
  typeof n == "boolean" ? (e = n) : t.push(n);
  const r = kr(),
    i = t.map((u) => r.children.find((g) => g.runner === u)).filter((u) => u),
    a = r.time();
  let h;
  if (e) {
    for (; i.find((u) => !u.canceled); ) yield;
    h = Math.max(...i.map((u) => u.time()));
  } else {
    for (; !i.find((g) => g.canceled); ) yield;
    const u = i.filter((g) => g.canceled);
    h = Math.min(...u.map((g) => g.time()));
  }
  r.time(Math.max(a, h));
}
function Dc(n) {
  return typeof (n == null ? void 0 : n.then) == "function";
}
ye(ea, dt());
function* ea(n, t) {
  const e = Vi(),
    r = n();
  sn(r, "root");
  const i = new Nn(r);
  t == null || t(i);
  let a = [i];
  for (; a.length > 0; ) {
    const h = [],
      u = [...a],
      g = e.deltaTime;
    for (; u.length > 0; ) {
      const b = u.pop();
      if (!b || b.canceled) continue;
      const x = b.next();
      if (x.done) {
        b.cancel();
        continue;
      }
      if (Qi(x.value)) {
        const O = new Nn(x.value);
        (b.value = x.value), b.add(O), u.push(b), u.push(O);
      } else
        x.value
          ? ((b.value = yield x.value), u.push(b))
          : (b.update(g),
            b.drain((O) => {
              const N = new Nn(O);
              b.add(N), h.unshift(N);
            }),
            h.unshift(b));
    }
    a = [];
    for (const b of h) b.canceled || (a.push(b), b.runDeferred());
    a.length > 0 && (yield);
  }
}
var Zt;
(function (n) {
  (n[(n.BeforeRender = 0)] = "BeforeRender"),
    (n[(n.BeginRender = 1)] = "BeginRender"),
    (n[(n.FinishRender = 2)] = "FinishRender"),
    (n[(n.AfterRender = 3)] = "AfterRender");
})(Zt || (Zt = {}));
class Nc {
  get onBeforeRender() {
    return this.beforeRender.subscribable;
  }
  get onBeginRender() {
    return this.beginRender.subscribable;
  }
  get onFinishRender() {
    return this.finishRender.subscribable;
  }
  get onAfterRender() {
    return this.afterRender.subscribable;
  }
  constructor(t) {
    (this.scene = t),
      (this.beforeRender = new qt()),
      (this.beginRender = new qt()),
      (this.finishRender = new qt()),
      (this.afterRender = new qt()),
      this.scene.onRenderLifecycle.subscribe(([e, r]) => {
        switch (e) {
          case Zt.BeforeRender:
            return this.beforeRender.dispatch(r);
          case Zt.BeginRender:
            return this.beginRender.dispatch(r);
          case Zt.FinishRender:
            return this.finishRender.dispatch(r);
          case Zt.AfterRender:
            return this.afterRender.dispatch(r);
        }
      }),
      this.scene.onReset.subscribe(() => {
        this.beforeRender.clear(),
          this.beginRender.clear(),
          this.finishRender.clear(),
          this.afterRender.clear();
      });
  }
}
class xr {
  constructor(t) {
    (this.state = t), (this.nextGauss = null);
  }
  static createSeed() {
    return Math.floor(Math.random() * 4294967296);
  }
  nextFloat(t = 0, e = 1) {
    return ot(t, e, this.next());
  }
  nextInt(t = 0, e = 4294967296) {
    let r = Math.floor(ot(t, e, this.next()));
    return r === e && (r = t), r;
  }
  gauss(t = 0, e = 1) {
    let r = this.nextGauss;
    if (((this.nextGauss = null), r === null)) {
      const i = this.next() * 2 * Math.PI,
        a = Math.sqrt(-2 * Math.log(1 - this.next()));
      (r = Math.cos(i) * a), (this.nextGauss = Math.sin(i) * a);
    }
    return t + r * e;
  }
  floatArray(t, e = 0, r = 1) {
    return Di(t).map(() => this.nextFloat(e, r));
  }
  intArray(t, e = 0, r = 4294967296) {
    return Di(t).map(() => this.nextInt(e, r));
  }
  spawn() {
    return new xr(this.nextInt());
  }
  next() {
    (this.state |= 0), (this.state = (this.state + 1831565813) | 0);
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  }
}
var St;
(function (n) {
  (n[(n.Initial = 0)] = "Initial"),
    (n[(n.AfterTransitionIn = 1)] = "AfterTransitionIn"),
    (n[(n.CanTransitionOut = 2)] = "CanTransitionOut"),
    (n[(n.Finished = 3)] = "Finished");
})(St || (St = {}));
const Wc = "resolution",
  Bc = "destinationTexture",
  Uc = "sourceTexture",
  Bi = "time",
  qc = "deltaTime",
  Gc = "framerate",
  Xc = "sourceMatrix",
  Hc = "destinationMatrix",
  Yc = `#version 300 es

in vec2 position;

out vec2 screenUV;
out vec2 sourceUV;
out vec2 destinationUV;

uniform mat4 sourceMatrix;
uniform mat4 destinationMatrix;

void main() {
    vec2 position_source = position * 0.5 + 0.5;
    vec4 position_screen = sourceMatrix * vec4(position_source, 0, 1);

    screenUV = position_screen.xy;
    sourceUV = position_source;
    destinationUV = (destinationMatrix * position_screen).xy;

    gl_Position = (position_screen - 0.5) * 2.0;
}
`;
class Zc {
  constructor(t, e) {
    (this.scene = t),
      (this.sharedContext = e),
      (this.gl = null),
      (this.positionBuffer = null),
      (this.sourceTexture = null),
      (this.destinationTexture = null),
      (this.positionLocation = 0),
      (this.quadPositions = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1])),
      (this.handleReload = () => {
        this.gl && this.updateViewport();
      }),
      t.onReloaded.subscribe(this.handleReload);
  }
  setup(t) {
    (this.gl = t),
      this.updateViewport(),
      (this.positionBuffer = t.createBuffer()),
      t.bindBuffer(t.ARRAY_BUFFER, this.positionBuffer),
      t.bufferData(t.ARRAY_BUFFER, this.quadPositions, t.STATIC_DRAW),
      t.vertexAttribPointer(this.positionLocation, 2, t.FLOAT, !1, 0, 0),
      t.enableVertexAttribArray(this.positionLocation),
      (this.sourceTexture = t.createTexture()),
      t.activeTexture(t.TEXTURE0),
      t.bindTexture(t.TEXTURE_2D, this.sourceTexture),
      t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
      t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
      (this.destinationTexture = t.createTexture()),
      t.activeTexture(t.TEXTURE1),
      t.bindTexture(t.TEXTURE_2D, this.destinationTexture),
      t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
      t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }
  teardown(t) {
    t.deleteBuffer(this.positionBuffer),
      t.disableVertexAttribArray(this.positionLocation),
      t.deleteTexture(this.sourceTexture),
      t.deleteTexture(this.destinationTexture),
      (this.positionBuffer = null),
      (this.sourceTexture = null),
      (this.destinationTexture = null),
      (this.gl = null);
  }
  updateViewport() {
    if (this.gl) {
      const t = this.scene.getRealSize();
      (this.gl.canvas.width = t.width),
        (this.gl.canvas.height = t.height),
        this.gl.viewport(0, 0, t.width, t.height);
    }
  }
  getGL() {
    return this.gl ?? this.sharedContext.borrow(this);
  }
  getProgram(t) {
    const e = this.sharedContext.getProgram(t, Yc);
    if (!e) return null;
    const r = this.scene.getRealSize(),
      i = this.getGL();
    return (
      i.useProgram(e),
      i.uniform1i(i.getUniformLocation(e, Uc), 0),
      i.uniform1i(i.getUniformLocation(e, Bc), 1),
      i.uniform2f(i.getUniformLocation(e, Wc), r.x, r.y),
      i.uniform1f(i.getUniformLocation(e, qc), this.scene.playback.deltaTime),
      i.uniform1f(i.getUniformLocation(e, Gc), this.scene.playback.fps),
      e
    );
  }
  copyTextures(t, e) {
    this.copyTexture(e, this.sourceTexture),
      this.copyTexture(t, this.destinationTexture);
  }
  clear() {
    const t = this.getGL();
    t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
  }
  render() {
    const t = this.getGL();
    t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
  }
  copyTexture(t, e) {
    const r = this.getGL();
    r.bindTexture(r.TEXTURE_2D, e),
      r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, t),
      r.generateMipmap(r.TEXTURE_2D);
  }
}
class Vc {
  get onChanged() {
    return this.slides.subscribable;
  }
  constructor(t) {
    (this.scene = t),
      (this.slides = new ge([])),
      (this.lookup = new Map()),
      (this.collisionLookup = new Set()),
      (this.current = null),
      (this.canResume = !1),
      (this.waitsForId = null),
      (this.targetId = null),
      (this.handleReload = () => {
        this.lookup.clear(),
          this.collisionLookup.clear(),
          (this.current = null),
          (this.waitsForId = null),
          (this.targetId = null);
      }),
      (this.handleReset = () => {
        this.collisionLookup.clear(),
          (this.current = null),
          (this.waitsForId = null);
      }),
      (this.handleRecalculated = () => {
        this.slides.current = [...this.lookup.values()];
      }),
      this.scene.onReloaded.subscribe(this.handleReload),
      this.scene.onReset.subscribe(this.handleReset),
      this.scene.onRecalculated.subscribe(this.handleRecalculated);
  }
  setTarget(t) {
    this.targetId = t;
  }
  resume() {
    this.canResume = !0;
  }
  isWaitingFor(t) {
    return this.waitsForId === t;
  }
  isWaiting() {
    return this.waitsForId !== null;
  }
  didHappen(t) {
    var e;
    if (this.current === null) return !1;
    for (const r of this.lookup.keys()) {
      if (r === t) return !0;
      if (r === ((e = this.current) == null ? void 0 : e.id)) return !1;
    }
    return !1;
  }
  getCurrent() {
    return this.current;
  }
  register(t, e) {
    if (this.waitsForId !== null)
      throw new Error(
        `The animation already waits for a slide: ${this.waitsForId}.`
      );
    const r = this.toId(t);
    this.scene.playback.state !== br.Presenting &&
      (this.lookup.has(r) ||
        this.lookup.set(r, {
          id: r,
          name: t,
          time: e,
          scene: this.scene,
          stack: new Error().stack,
        }),
      this.collisionLookup.has(t)
        ? this.scene.logger.warn({
            message: `A slide named "${t}" already exists.`,
            stack: new Error().stack,
          })
        : this.collisionLookup.add(t)),
      (this.waitsForId = r),
      (this.current = this.lookup.get(r) ?? null),
      (this.canResume = !1);
  }
  shouldWait(t) {
    const e = this.toId(t);
    if (this.waitsForId !== e)
      throw new Error(
        `The animation waits for a different slide: ${this.waitsForId}.`
      );
    if (!this.lookup.get(e))
      throw new Error(`Could not find the "${t}" slide.`);
    let i = this.canResume;
    return (
      this.scene.playback.state !== br.Presenting && (i = e !== this.targetId),
      i && (this.waitsForId = null),
      !i
    );
  }
  toId(t) {
    return `${this.scene.name}:${t}`;
  }
}
class Jc {
  constructor(t) {
    (this.scene = t),
      (this.signals = {}),
      (this.variables = {}),
      (this.handleReset = () => {
        this.signals = {};
      }),
      t.onReset.subscribe(this.handleReset);
  }
  get(t, e) {
    var r;
    return (
      (r = this.signals)[t] ?? (r[t] = ze(this.variables[t] ?? e)),
      () => this.signals[t]()
    );
  }
  updateSignals(t) {
    (this.variables = t),
      Object.keys(t).map((e) => {
        e in this.signals && this.signals[e](t[e]);
      });
  }
}
class Qc {
  get firstFrame() {
    return this.cache.current.firstFrame;
  }
  get lastFrame() {
    return this.firstFrame + this.cache.current.duration;
  }
  get onCacheChanged() {
    return this.cache.subscribable;
  }
  get onReloaded() {
    return this.reloaded.subscribable;
  }
  get onRecalculated() {
    return this.recalculated.subscribable;
  }
  get onThreadChanged() {
    return this.thread.subscribable;
  }
  get onRenderLifecycle() {
    return this.renderLifecycle.subscribable;
  }
  get onReset() {
    return this.afterReset.subscribable;
  }
  get LifecycleEvents() {
    return (
      this.logger.warn(
        "LifecycleEvents is deprecated. Use lifecycleEvents instead."
      ),
      this.lifecycleEvents
    );
  }
  get previous() {
    return this.previousScene;
  }
  constructor(t) {
    (this.cache = new ge({
      firstFrame: 0,
      transitionDuration: 0,
      duration: 0,
      lastFrame: 0,
    })),
      (this.reloaded = new qt()),
      (this.recalculated = new qt()),
      (this.thread = new ge(null)),
      (this.renderLifecycle = new qt()),
      (this.afterReset = new qt()),
      (this.lifecycleEvents = new Nc(this)),
      (this.previousScene = null),
      (this.runner = null),
      (this.state = St.Initial),
      (this.cached = !1),
      (this.counters = {}),
      (this.name = t.name),
      (this.size = t.size),
      (this.resolutionScale = t.resolutionScale),
      (this.logger = t.logger),
      (this.playback = t.playback),
      (this.meta = t.meta),
      (this.runnerFactory = t.config),
      (this.creationStack = t.stack),
      (this.experimentalFeatures = t.experimentalFeatures ?? !1),
      ye(this.runnerFactory, dt(this.name)),
      (this.timeEvents = new t.timeEventsClass(this)),
      (this.variables = new Jc(this)),
      (this.shaders = new Zc(this, t.sharedWebGLContext)),
      (this.slides = new Vc(this)),
      (this.random = new xr(this.meta.seed.get())),
      (this.previousOnTop = !1);
  }
  update() {}
  async render(t) {
    let e = 0;
    do
      e++,
        await gt.consumePromises(),
        t.save(),
        t.clearRect(0, 0, t.canvas.width, t.canvas.height),
        this.execute(() => this.draw(t)),
        t.restore();
    while (gt.hasPromises() && e < 10);
    e > 1 && this.logger.debug(`render iterations: ${e}`);
  }
  reload({ config: t, size: e, stack: r, resolutionScale: i } = {}) {
    t && (this.runnerFactory = t),
      e && (this.size = e),
      i && (this.resolutionScale = i),
      r && (this.creationStack = r),
      (this.cached = !1),
      this.reloaded.dispatch();
  }
  async recalculate(t) {
    const e = this.cache.current;
    if (
      ((e.firstFrame = this.playback.frame),
      (e.lastFrame = e.firstFrame + e.duration),
      this.isCached())
    ) {
      t(e.lastFrame), (this.cache.current = { ...e });
      return;
    }
    for (
      e.transitionDuration = -1, await this.reset();
      !this.canTransitionOut();

    )
      e.transitionDuration < 0 &&
        this.state === St.AfterTransitionIn &&
        (e.transitionDuration = this.playback.frame - e.firstFrame),
        t(this.playback.frame + 1),
        await this.next();
    e.transitionDuration === -1 && (e.transitionDuration = 0),
      (e.lastFrame = this.playback.frame),
      (e.duration = e.lastFrame - e.firstFrame),
      await new Promise((r) => setTimeout(r, 0)),
      (this.cached = !0),
      (this.cache.current = { ...e }),
      this.recalculated.dispatch();
  }
  async next() {
    var e;
    if (!this.runner) return;
    let t = this.execute(() => this.runner.next());
    for (this.update(); t.value; ) {
      if (_c(t.value)) {
        const r = await t.value.toPromise();
        t = this.execute(() => this.runner.next(r));
      } else if (Dc(t.value)) {
        const r = await t.value;
        t = this.execute(() => this.runner.next(r));
      } else
        this.logger.warn({
          message: "Invalid value yielded by the scene.",
          object: t.value,
        }),
          (t = this.execute(() => this.runner.next(t.value)));
      this.update();
    }
    if (gt.hasPromises()) {
      const r = await gt.consumePromises();
      this.logger.error({
        message:
          "Tried to access an asynchronous property before the node was ready. Make sure to yield the node before accessing the property.",
        stack: r[0].stack,
        inspect: ((e = r[0].owner) == null ? void 0 : e.key) ?? void 0,
      });
    }
    t.done && (this.state = St.Finished);
  }
  async reset(t = null) {
    (this.counters = {}),
      (this.previousScene = t),
      (this.previousOnTop = !1),
      (this.random = new xr(this.meta.seed.get())),
      (this.runner = ea(
        () => this.runnerFactory(this.getView()),
        (e) => {
          this.thread.current = e;
        }
      )),
      (this.state = St.AfterTransitionIn),
      this.afterReset.dispatch(),
      await this.next();
  }
  getSize() {
    return this.size;
  }
  getRealSize() {
    return this.size.mul(this.resolutionScale);
  }
  isAfterTransitionIn() {
    return this.state === St.AfterTransitionIn;
  }
  canTransitionOut() {
    return this.state === St.CanTransitionOut || this.state === St.Finished;
  }
  isFinished() {
    return this.state === St.Finished;
  }
  enterInitial() {
    this.state === St.AfterTransitionIn
      ? (this.state = St.Initial)
      : this.logger.warn(
          `Scene ${this.name} entered initial in an unexpected state: ${this.state}`
        );
  }
  enterAfterTransitionIn() {
    this.state === St.Initial
      ? (this.state = St.AfterTransitionIn)
      : this.logger.warn(
          `Scene ${this.name} transitioned in an unexpected state: ${this.state}`
        );
  }
  enterCanTransitionOut() {
    this.state === St.AfterTransitionIn || this.state === St.Initial
      ? (this.state = St.CanTransitionOut)
      : this.logger.warn(
          `Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`
        );
  }
  isCached() {
    return this.cached;
  }
  execute(t) {
    let e;
    Sc(this), Ic(this.playback);
    try {
      e = t();
    } finally {
      Ec(this.playback), Tc(this);
    }
    return e;
  }
}
function Kc() {
  return new ne("scene", {
    version: new Ot("version", 1),
    timeEvents: new Ot("time events", []),
    seed: new Ot("seed", xr.createSeed()),
  });
}
function ra(n, t, e) {
  const r = [...n],
    i = [...t];
  if (i.length >= r.length) {
    const a = Math.floor(i.length * e),
      h = Math.floor(ot(r.length - 1, i.length, e));
    let u = "";
    for (let g = 0; g < i.length; g++)
      g < a ? (u += i[g]) : (r[g] || g <= h) && (u += r[g] ?? i[g]);
    return u;
  } else {
    const a = Math.round(r.length * (1 - e)),
      h = Math.floor(ot(r.length + 1, i.length, e)),
      u = [];
    for (let g = r.length - 1; g >= 0; g--)
      g < a ? u.unshift(r[g]) : (i[g] || g < h) && u.unshift(i[g] ?? r[g]);
    return u.join("");
  }
}
function Ke(n, t, e, r = !1) {
  if (e === 0) return n;
  if (e === 1) return t;
  if (n == null || t == null) {
    r ||
      Tt().warn(
        `Attempting to lerp ${n} -> ${t} may result in unexpected behavior.`
      );
    return;
  }
  if (typeof n == "number" && typeof t == "number") return ot(n, t, e);
  if (typeof n == "string" && typeof t == "string") return ra(n, t, e);
  if (typeof n == "boolean" && typeof t == "boolean") return e < 0.5 ? n : t;
  if ("lerp" in n) return n.lerp(t, e);
  if (n && t && typeof n == "object" && typeof t == "object")
    if (Array.isArray(n) && Array.isArray(t)) {
      if (n.length === t.length) return n.map((i, a) => Ke(i, t[a], e));
    } else {
      let i = !1;
      if (
        (!(n instanceof Map) &&
          !(t instanceof Map) &&
          ((i = !0),
          (n = new Map(Object.entries(n))),
          (t = new Map(Object.entries(t)))),
        n instanceof Map && t instanceof Map)
      ) {
        const a = new Map();
        for (const h of new Set([...n.keys(), ...t.keys()])) {
          const u = Ke(n.get(h), t.get(h), e, !0);
          u !== void 0 && a.set(h, u);
        }
        return i ? Object.fromEntries(a) : a;
      }
    }
  return t;
}
function tu(n, t, e) {
  return e < 0.5 ? n : t;
}
function ot(n, t, e) {
  return n + (t - n) * e;
}
function eu(n, t, e, r, i) {
  return e + ((i - n) * (r - e)) / (t - n);
}
function Lt(n, t, e) {
  return e < n ? n : e > t ? t : e;
}
function na(n, t, e) {
  let r = t;
  e > 1 ? (e = 1 / e) : (r = !r);
  const i = r ? Math.acos(Lt(-1, 1, 1 - n)) : Math.asin(n),
    a = ot(i, ot(0, Math.PI / 2, n), e);
  let h = Math.sin(a),
    u = 1 - Math.cos(a);
  return t && ([h, u] = [u, h]), new v(h, u);
}
function Yt(n, t = 0, e = 1) {
  return (
    (n = n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2), ot(t, e, n)
  );
}
function ru(n, t = 0, e = 1) {
  return (n = n === 1 ? 1 : 1 - Math.pow(2, -10 * n)), ot(t, e, n);
}
function nu(n, t = 0, e = 1) {
  return ot(t, e, n);
}
ye(Ut, dt());
function* Ut(n, t, e) {
  const r = kr(),
    i = r.time(),
    a = r.time() + n;
  for (t(0, 0); a > r.fixed; ) {
    const h = r.fixed - i,
      u = h / n;
    h > 0 && t(u, h), yield;
  }
  r.time(a), t(1, n), e == null || e(1, n);
}
class gt {
  static collectPromise(t, e = null) {
    const r = { promise: t, value: e, stack: new Error().stack },
      i = this.collectionStack.at(-1);
    return (
      i && (r.owner = i.owner),
      t.then((a) => {
        (r.value = a), i == null || i.markDirty();
      }),
      this.promises.push(r),
      r
    );
  }
  static hasPromises() {
    return this.promises.length > 0;
  }
  static async consumePromises() {
    const t = [...this.promises];
    return (
      await Promise.all(t.map((e) => e.promise)),
      (this.promises = this.promises.filter((e) => !t.includes(e))),
      t
    );
  }
  constructor(t) {
    (this.owner = t),
      (this.dependencies = new Set()),
      (this.event = new bc()),
      (this.markDirty = () => this.event.raise()),
      (this.invokable = this.invoke.bind(this)),
      Object.defineProperty(this.invokable, "context", { value: this }),
      Object.defineProperty(this.invokable, "toPromise", {
        value: this.toPromise.bind(this),
      });
  }
  invoke() {}
  startCollecting() {
    if (gt.collectionSet.has(this))
      throw new Yi(
        "A circular dependency occurred between signals.",
        `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`
      );
    gt.collectionSet.add(this), gt.collectionStack.push(this);
  }
  finishCollecting() {
    if ((gt.collectionSet.delete(this), gt.collectionStack.pop() !== this))
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((t) => t.unsubscribe(this.markDirty)),
      this.dependencies.clear();
  }
  collect() {
    const t = gt.collectionStack.at(-1);
    t &&
      (t.dependencies.add(this.event.subscribable),
      this.event.subscribe(t.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), (this.owner = null);
  }
  async toPromise() {
    do await gt.consumePromises(), this.invokable();
    while (gt.hasPromises());
    return this.invokable;
  }
}
gt.collectionSet = new Set();
gt.collectionStack = [];
gt.promises = [];
const Qe = Symbol.for("@motion-canvas/core/signals/default");
function se(n) {
  return typeof n == "function";
}
function Me(n, t) {
  return se(n) ? () => t(n()) : t(n);
}
function Jt(n) {
  return se(n) ? n() : n;
}
class Ae extends gt {
  constructor(t, e, r = void 0, i = (h) => h, a = {}) {
    super(r),
      (this.initial = t),
      (this.interpolation = e),
      (this.parser = i),
      (this.tweening = !1),
      Object.defineProperty(this.invokable, "reset", {
        value: this.reset.bind(this),
      }),
      Object.defineProperty(this.invokable, "save", {
        value: this.save.bind(this),
      }),
      Object.defineProperty(this.invokable, "isInitial", {
        value: this.isInitial.bind(this),
      }),
      this.initial !== void 0 &&
        ((this.current = this.initial),
        this.markDirty(),
        se(this.initial) || (this.last = this.parse(this.initial))),
      (this.extensions = {
        getter: this.getter.bind(this),
        setter: this.setter.bind(this),
        tweener: this.tweener.bind(this),
        ...a,
      });
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  set(t) {
    return this.extensions.setter(t), this.owner;
  }
  setter(t) {
    return (
      t === Qe && (t = this.initial),
      this.current === t
        ? this.owner
        : ((this.current = t),
          this.clearDependencies(),
          se(t) || (this.last = this.parse(t)),
          this.markDirty(),
          this.owner)
    );
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var t;
    if (this.event.isRaised() && se(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e) {
        Tt().error({
          ...Zi(e),
          inspect: (t = this.owner) == null ? void 0 : t.key,
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(t, e, r = Yt, i = this.interpolation) {
    return t === void 0
      ? this.get()
      : e === void 0
      ? this.set(t)
      : this.createQueue(r, i).to(t, e);
  }
  createQueue(t, e) {
    const r = this.get(),
      i = [],
      a = Wi("animation chain", function* () {
        for (; i.length > 0; ) yield* i.shift();
      });
    return (
      (a.to = (h, u, g = t, b = e) => (
        (t = g), (e = b), i.push(this.tween(h, u, g, b)), a
      )),
      (a.back = (h, u = t, g = e) => (
        (t = u), (e = g), i.push(this.tween(r, h, t, e)), a
      )),
      (a.wait = (h) => (i.push(wr(h)), a)),
      (a.run = (h) => (i.push(h), a)),
      (a.do = (h) => (
        i.push(
          Wi(function* () {
            h();
          })
        ),
        a
      )),
      a
    );
  }
  *tween(t, e, r, i) {
    t === Qe && (t = this.initial),
      (this.tweening = !0),
      yield* this.extensions.tweener(t, e, r, i),
      this.set(t),
      (this.tweening = !1);
  }
  *tweener(t, e, r, i) {
    const a = this.get();
    yield* Ut(e, (h) => {
      this.set(i(a, this.parse(Jt(t)), r(h)));
    });
  }
  dispose() {
    super.dispose(),
      (this.initial = void 0),
      (this.current = void 0),
      (this.last = void 0);
  }
  reset() {
    return this.initial !== void 0 && this.set(this.initial), this.owner;
  }
  save() {
    return this.set(this.get());
  }
  isInitial() {
    return this.collect(), this.current === this.initial;
  }
  getInitial() {
    return this.initial;
  }
  raw() {
    return this.current;
  }
  isTweening() {
    return this.tweening;
  }
}
class hn extends Ae {
  constructor(t, e, r, i, a = void 0, h = {}) {
    var u;
    super(void 0, i, a, e, h),
      (this.entries = t),
      (this.signals = []),
      (this.parser = e);
    for (const g of t) {
      let b, x;
      Array.isArray(g)
        ? (([b, x] = g), (u = x.context).owner ?? (u.owner = this))
        : ((b = g),
          (x = new Ae(
            Me(r, (O) => e(O)[g]),
            ot,
            a ?? this.invokable
          ).toSignal())),
        this.signals.push([b, x]),
        Object.defineProperty(this.invokable, b, { value: x });
    }
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  getter() {
    return this.parse(
      Object.fromEntries(this.signals.map(([t, e]) => [t, e()]))
    );
  }
  setter(t) {
    if (se(t)) for (const [e, r] of this.signals) r(() => this.parser(t())[e]);
    else {
      const e = this.parse(t);
      for (const [r, i] of this.signals) i(e[r]);
    }
    return this.owner;
  }
  reset() {
    for (const [, t] of this.signals) t.reset();
    return this.owner;
  }
  save() {
    for (const [, t] of this.signals) t.save();
    return this.owner;
  }
  isInitial() {
    for (const [, t] of this.signals) if (!t.isInitial()) return !1;
    return !0;
  }
  raw() {
    return Object.fromEntries(
      this.signals.map(([t, e]) => [t, e.context.raw()])
    );
  }
}
class su extends gt {
  constructor(t, e) {
    super(e), (this.factory = t), this.markDirty();
  }
  toSignal() {
    return this.invokable;
  }
  dispose() {
    super.dispose(), (this.last = void 0);
  }
  invoke(...t) {
    var e;
    if (this.event.isRaised()) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.factory(...t);
      } catch (r) {
        Tt().error({
          ...Zi(r),
          inspect: (e = this.owner) == null ? void 0 : e.key,
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
}
class sa extends hn {
  constructor(t, e, r, i, a = void 0, h = {}) {
    super(t, e, r, i, a, h),
      Object.defineProperty(this.invokable, "edit", {
        value: this.edit.bind(this),
      }),
      Object.defineProperty(this.invokable, "mul", {
        value: this.mul.bind(this),
      }),
      Object.defineProperty(this.invokable, "div", {
        value: this.div.bind(this),
      }),
      Object.defineProperty(this.invokable, "add", {
        value: this.add.bind(this),
      }),
      Object.defineProperty(this.invokable, "sub", {
        value: this.sub.bind(this),
      }),
      Object.defineProperty(this.invokable, "dot", {
        value: this.dot.bind(this),
      }),
      Object.defineProperty(this.invokable, "cross", {
        value: this.cross.bind(this),
      }),
      Object.defineProperty(this.invokable, "mod", {
        value: this.mod.bind(this),
      });
  }
  toSignal() {
    return this.invokable;
  }
  edit(t, e, r, i) {
    const a = t(this.get());
    return this.invoke(a, e, r, i);
  }
  mul(t, e, r, i) {
    const a = (h) => h.mul(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  div(t, e, r, i) {
    const a = (h) => h.div(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  add(t, e, r, i) {
    const a = (h) => h.add(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  sub(t, e, r, i) {
    const a = (h) => h.sub(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  dot(t, e, r, i) {
    const a = (h) => h.dot(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  cross(t, e, r, i) {
    const a = (h) => h.cross(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  mod(t, e, r, i) {
    const a = (h) => h.mod(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
}
function iu(n, t) {
  return new su(n, t).toSignal();
}
function ze(n, t = Ke, e) {
  return new Ae(n, t, e).toSignal();
}
class Bt {
  static createSignal(t, e = Bt.lerp) {
    return new hn(
      ["top", "right", "bottom", "left"],
      (r) => new Bt(r),
      t,
      e
    ).toSignal();
  }
  static lerp(t, e, r) {
    return new Bt(
      ot(t.top, e.top, r),
      ot(t.right, e.right, r),
      ot(t.bottom, e.bottom, r),
      ot(t.left, e.left, r)
    );
  }
  get x() {
    return this.left + this.right;
  }
  get y() {
    return this.top + this.bottom;
  }
  constructor(t = 0, e, r, i) {
    if (
      ((this.top = 0),
      (this.right = 0),
      (this.bottom = 0),
      (this.left = 0),
      t != null)
    ) {
      if (
        (Array.isArray(t) && ((i = t[3]), (r = t[2]), (e = t[1]), (t = t[0])),
        typeof t == "number")
      ) {
        (this.top = t),
          (this.right = e !== void 0 ? e : t),
          (this.bottom = r !== void 0 ? r : t),
          (this.left = i !== void 0 ? i : e !== void 0 ? e : t);
        return;
      }
      (this.top = t.top),
        (this.right = t.right),
        (this.bottom = t.bottom),
        (this.left = t.left);
    }
  }
  lerp(t, e) {
    return Bt.lerp(this, t, e);
  }
  scale(t) {
    return new Bt(this.top * t, this.right * t, this.bottom * t, this.left * t);
  }
  addScalar(t) {
    return new Bt(this.top + t, this.right + t, this.bottom + t, this.left + t);
  }
  toSymbol() {
    return Bt.symbol;
  }
  toString() {
    return `Spacing(${this.top}, ${this.right}, ${this.bottom}, ${this.left})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.top, this.right, this.bottom, this.left);
  }
  serialize() {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }
}
Bt.symbol = Symbol.for("@motion-canvas/core/types/Spacing");
const mr = 1e-6;
class ut {
  static fromRotation(t) {
    return ut.identity.rotate(t);
  }
  static fromTranslation(t) {
    return ut.identity.translate(new v(t));
  }
  static fromScaling(t) {
    return ut.identity.scale(new v(t));
  }
  get x() {
    return new v(this.values[0], this.values[1]);
  }
  get y() {
    return new v(this.values[2], this.values[3]);
  }
  get scaleX() {
    return this.values[0];
  }
  set scaleX(t) {
    this.values[0] = this.x.normalized.scale(t).x;
  }
  get skewX() {
    return this.values[1];
  }
  set skewX(t) {
    this.values[1] = t;
  }
  get scaleY() {
    return this.values[3];
  }
  set scaleY(t) {
    this.values[3] = this.y.normalized.scale(t).y;
  }
  get skewY() {
    return this.values[2];
  }
  set skewY(t) {
    this.values[2] = t;
  }
  get translateX() {
    return this.values[4];
  }
  set translateX(t) {
    this.values[4] = t;
  }
  get translateY() {
    return this.values[5];
  }
  set translateY(t) {
    this.values[5] = t;
  }
  get rotation() {
    return v.degrees(this.values[0], this.values[1]);
  }
  set rotation(t) {
    const e = this.rotate(t - this.rotation);
    (this.values[0] = e.values[0]),
      (this.values[1] = e.values[1]),
      (this.values[2] = e.values[2]),
      (this.values[3] = e.values[3]);
  }
  get translation() {
    return new v(this.values[4], this.values[5]);
  }
  set translation(t) {
    const e = new v(t);
    (this.values[4] = e.x), (this.values[5] = e.y);
  }
  get scaling() {
    return new v(this.values[0], this.values[3]);
  }
  set scaling(t) {
    const e = new v(t),
      r = new v(this.values[0], this.values[1]).normalized,
      i = new v(this.values[2], this.values[3]).normalized;
    (this.values[0] = r.x * e.x),
      (this.values[1] = r.y * e.y),
      (this.values[2] = i.x * e.x),
      (this.values[3] = i.y * e.y);
  }
  get inverse() {
    const t = this.values[0],
      e = this.values[1],
      r = this.values[2],
      i = this.values[3],
      a = this.values[4],
      h = this.values[5];
    let u = t * i - e * r;
    return u
      ? ((u = 1 / u),
        new ut(
          i * u,
          -e * u,
          -r * u,
          t * u,
          (r * h - i * a) * u,
          (e * a - t * h) * u
        ))
      : null;
  }
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
      this.values[5],
    ]);
  }
  constructor(t, e, r, i, a, h) {
    if (((this.values = new Float32Array(6)), arguments.length === 0)) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      (this.values[0] = t),
        (this.values[1] = e),
        (this.values[2] = r),
        (this.values[3] = i),
        (this.values[4] = a),
        (this.values[5] = h);
      return;
    }
    if (t instanceof DOMMatrix) {
      (this.values[0] = t.m11),
        (this.values[1] = t.m12),
        (this.values[2] = t.m21),
        (this.values[3] = t.m22),
        (this.values[4] = t.m41),
        (this.values[5] = t.m42);
      return;
    }
    if (t instanceof ut) {
      this.values = t.values;
      return;
    }
    if (Array.isArray(t)) {
      if (t.length === 2) {
        (this.values[0] = t[0]),
          (this.values[1] = t[1]),
          (this.values[2] = e[0]),
          (this.values[3] = e[1]),
          (this.values[4] = r[0]),
          (this.values[5] = r[1]);
        return;
      }
      if (t.length === 3) {
        const x = new v(t[0]),
          O = new v(t[1]),
          N = new v(t[2]);
        (this.values[0] = x.x),
          (this.values[1] = x.y),
          (this.values[2] = O.x),
          (this.values[3] = O.y),
          (this.values[4] = N.x),
          (this.values[5] = N.y);
        return;
      }
      (this.values[0] = t[0]),
        (this.values[1] = t[1]),
        (this.values[2] = t[2]),
        (this.values[3] = t[3]),
        (this.values[4] = t[4]),
        (this.values[5] = t[5]);
      return;
    }
    const u = new v(t),
      g = new v(e),
      b = new v(r);
    (this.values[0] = u.x),
      (this.values[1] = u.y),
      (this.values[2] = g.x),
      (this.values[3] = g.y),
      (this.values[4] = b.x),
      (this.values[5] = b.y);
  }
  column(t) {
    return new v(this.values[t * 2], this.values[t * 2 + 1]);
  }
  row(t) {
    return [this.values[t], this.values[t + 2], this.values[t + 4]];
  }
  mul(t) {
    const e = this.values[0],
      r = this.values[1],
      i = this.values[2],
      a = this.values[3],
      h = this.values[4],
      u = this.values[5],
      g = t.values[0],
      b = t.values[1],
      x = t.values[2],
      O = t.values[3],
      N = t.values[4],
      Y = t.values[5];
    return new ut(
      e * g + i * b,
      r * g + a * b,
      e * x + i * O,
      r * x + a * O,
      e * N + i * Y + h,
      r * N + a * Y + u
    );
  }
  rotate(t, e = !0) {
    e && (t *= Un);
    const r = this.values[0],
      i = this.values[1],
      a = this.values[2],
      h = this.values[3],
      u = this.values[4],
      g = this.values[5],
      b = Math.sin(t),
      x = Math.cos(t);
    return new ut(
      r * x + a * b,
      i * x + h * b,
      r * -b + a * x,
      i * -b + h * x,
      u,
      g
    );
  }
  scale(t) {
    const e = new v(t);
    return new ut(
      this.values[0] * e.x,
      this.values[1] * e.x,
      this.values[2] * e.y,
      this.values[3] * e.y,
      this.values[4],
      this.values[5]
    );
  }
  mulScalar(t) {
    return new ut(
      this.values[0] * t,
      this.values[1] * t,
      this.values[2] * t,
      this.values[3] * t,
      this.values[4] * t,
      this.values[5] * t
    );
  }
  translate(t) {
    const e = new v(t);
    return new ut(
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[0] * e.x + this.values[2] * e.y + this.values[4],
      this.values[1] * e.x + this.values[3] * e.y + this.values[5]
    );
  }
  add(t) {
    return new ut(
      this.values[0] + t.values[0],
      this.values[1] + t.values[1],
      this.values[2] + t.values[2],
      this.values[3] + t.values[3],
      this.values[4] + t.values[4],
      this.values[5] + t.values[5]
    );
  }
  sub(t) {
    return new ut(
      this.values[0] - t.values[0],
      this.values[1] - t.values[1],
      this.values[2] - t.values[2],
      this.values[3] - t.values[3],
      this.values[4] - t.values[4],
      this.values[5] - t.values[5]
    );
  }
  toSymbol() {
    return ut.symbol;
  }
  toUniform(t, e) {
    t.uniformMatrix3fv(e, !1, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1,
    ]);
  }
  equals(t, e = mr) {
    return (
      Math.abs(this.values[0] - t.values[0]) <= e + Number.EPSILON &&
      Math.abs(this.values[1] - t.values[1]) <= e + Number.EPSILON &&
      Math.abs(this.values[2] - t.values[2]) <= e + Number.EPSILON &&
      Math.abs(this.values[3] - t.values[3]) <= e + Number.EPSILON &&
      Math.abs(this.values[4] - t.values[4]) <= e + Number.EPSILON &&
      Math.abs(this.values[5] - t.values[5]) <= e + Number.EPSILON
    );
  }
  exactlyEquals(t) {
    return (
      this.values[0] === t.values[0] &&
      this.values[1] === t.values[1] &&
      this.values[2] === t.values[2] &&
      this.values[3] === t.values[3] &&
      this.values[4] === t.values[4] &&
      this.values[5] === t.values[5]
    );
  }
}
ut.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
ut.identity = new ut(1, 0, 0, 1, 0, 0);
ut.zero = new ut(0, 0, 0, 0, 0, 0);
var Ui;
(function (n) {
  (n[(n.Vertical = 1)] = "Vertical"), (n[(n.Horizontal = 2)] = "Horizontal");
})(Ui || (Ui = {}));
var $t;
(function (n) {
  (n[(n.Top = 4)] = "Top"),
    (n[(n.Bottom = 8)] = "Bottom"),
    (n[(n.Left = 16)] = "Left"),
    (n[(n.Right = 32)] = "Right");
})($t || ($t = {}));
var ft;
(function (n) {
  (n[(n.Middle = 3)] = "Middle"),
    (n[(n.Top = 5)] = "Top"),
    (n[(n.Bottom = 9)] = "Bottom"),
    (n[(n.Left = 18)] = "Left"),
    (n[(n.Right = 34)] = "Right"),
    (n[(n.TopLeft = 20)] = "TopLeft"),
    (n[(n.TopRight = 36)] = "TopRight"),
    (n[(n.BottomLeft = 24)] = "BottomLeft"),
    (n[(n.BottomRight = 40)] = "BottomRight");
})(ft || (ft = {}));
function au(n) {
  if (n === ft.Middle) return v.zero;
  let t = 0;
  n & $t.Left ? (t = -1) : n & $t.Right && (t = 1);
  let e = 0;
  return n & $t.Top ? (e = -1) : n & $t.Bottom && (e = 1), new v(t, e);
}
class v {
  static createSignal(t, e = v.lerp, r) {
    return new sa(["x", "y"], (i) => new v(i), t, e, r).toSignal();
  }
  static lerp(t, e, r) {
    let i, a;
    return (
      typeof r == "number" ? (i = a = r) : ((i = r.x), (a = r.y)),
      new v(ot(t.x, e.x, i), ot(t.y, e.y, a))
    );
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = t.sub(e).ctg), v.lerp(t, e, na(r, i, a));
  }
  static createArcLerp(t, e) {
    return (r, i, a) => v.arcLerp(r, i, a, t, e);
  }
  static polarLerp(t, e, r, i = !1, a = v.zero) {
    (t = t.sub(a)), (e = e.sub(a));
    const h = t.degrees;
    let u = e.degrees;
    h > u !== i && (u = u + (i ? -360 : 360));
    const b = ot(h, u, r) * Un,
      x = ot(t.magnitude, e.magnitude, r);
    return new v(x * Math.cos(b) + a.x, x * Math.sin(b) + a.y);
  }
  static createPolarLerp(t = !1, e = v.zero) {
    return (r, i, a) => v.polarLerp(r, i, a, t, new v(e));
  }
  static fromOrigin(t) {
    const e = new v();
    return (
      t === ft.Middle ||
        (t & $t.Left ? (e.x = -1) : t & $t.Right && (e.x = 1),
        t & $t.Top ? (e.y = -1) : t & $t.Bottom && (e.y = 1)),
      e
    );
  }
  static fromScalar(t) {
    return new v(t, t);
  }
  static fromRadians(t) {
    return new v(Math.cos(t), Math.sin(t));
  }
  static fromDegrees(t) {
    return v.fromRadians(t * Un);
  }
  static radians(t, e) {
    return Math.atan2(e, t);
  }
  static degrees(t, e) {
    return v.radians(t, e) * Oc;
  }
  static magnitude(t, e) {
    return Math.sqrt(t * t + e * e);
  }
  static squaredMagnitude(t, e) {
    return t * t + e * e;
  }
  static angleBetween(t, e) {
    return (
      Math.acos(Lt(-1, 1, t.dot(e) / (t.magnitude * e.magnitude))) *
      (t.cross(e) >= 0 ? 1 : -1)
    );
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  get magnitude() {
    return v.magnitude(this.x, this.y);
  }
  get squaredMagnitude() {
    return v.squaredMagnitude(this.x, this.y);
  }
  get normalized() {
    return this.scale(1 / v.magnitude(this.x, this.y));
  }
  get safe() {
    return new v(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }
  get flipped() {
    return new v(-this.x, -this.y);
  }
  get floored() {
    return new v(Math.floor(this.x), Math.floor(this.y));
  }
  get rounded() {
    return new v(Math.round(this.x), Math.round(this.y));
  }
  get ceiled() {
    return new v(Math.ceil(this.x), Math.ceil(this.y));
  }
  get perpendicular() {
    return new v(this.y, -this.x);
  }
  get radians() {
    return v.radians(this.x, this.y);
  }
  get degrees() {
    return v.degrees(this.x, this.y);
  }
  get ctg() {
    return this.x / this.y;
  }
  constructor(t, e) {
    if (((this.x = 0), (this.y = 0), t != null)) {
      if (typeof t != "object") {
        (this.x = t), (this.y = e ?? t);
        return;
      }
      if (Array.isArray(t)) {
        (this.x = t[0]), (this.y = t[1]);
        return;
      }
      if ("width" in t) {
        (this.x = t.width), (this.y = t.height);
        return;
      }
      (this.x = t.x), (this.y = t.y);
    }
  }
  lerp(t, e) {
    return v.lerp(this, t, e);
  }
  getOriginOffset(t) {
    const e = v.fromOrigin(t);
    return (e.x *= this.x / 2), (e.y *= this.y / 2), e;
  }
  scale(t) {
    return new v(this.x * t, this.y * t);
  }
  transformAsPoint(t) {
    const e = new ut(t);
    return new v(
      this.x * e.scaleX + this.y * e.skewY + e.translateX,
      this.x * e.skewX + this.y * e.scaleY + e.translateY
    );
  }
  transform(t) {
    const e = new ut(t);
    return new v(
      this.x * e.scaleX + this.y * e.skewY,
      this.x * e.skewX + this.y * e.scaleY
    );
  }
  mul(t) {
    const e = new v(t);
    return new v(this.x * e.x, this.y * e.y);
  }
  div(t) {
    const e = new v(t);
    return new v(this.x / e.x, this.y / e.y);
  }
  add(t) {
    const e = new v(t);
    return new v(this.x + e.x, this.y + e.y);
  }
  sub(t) {
    const e = new v(t);
    return new v(this.x - e.x, this.y - e.y);
  }
  dot(t) {
    const e = new v(t);
    return this.x * e.x + this.y * e.y;
  }
  cross(t) {
    const e = new v(t);
    return this.x * e.y - this.y * e.x;
  }
  mod(t) {
    const e = new v(t);
    return new v(this.x % e.x, this.y % e.y);
  }
  rotate(t, e = v.zero) {
    const r = new v(e),
      i = ut.fromTranslation(r).rotate(t).translate(r.flipped);
    return this.transformAsPoint(i);
  }
  addX(t) {
    return new v(this.x + t, this.y);
  }
  addY(t) {
    return new v(this.x, this.y + t);
  }
  map(t) {
    return new v(t(this.x, 0), t(this.y, 1));
  }
  toSymbol() {
    return v.symbol;
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  toArray() {
    return [this.x, this.y];
  }
  toUniform(t, e) {
    t.uniform2f(e, this.x, this.y);
  }
  serialize() {
    return { x: this.x, y: this.y };
  }
  exactlyEquals(t) {
    return this.x === t.x && this.y === t.y;
  }
  equals(t, e = mr) {
    return (
      Math.abs(this.x - t.x) <= e + Number.EPSILON &&
      Math.abs(this.y - t.y) <= e + Number.EPSILON
    );
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
v.symbol = Symbol.for("@motion-canvas/core/types/Vector2");
v.zero = new v();
v.one = new v(1, 1);
v.right = new v(1, 0);
v.left = new v(-1, 0);
v.up = new v(0, 1);
v.down = new v(0, -1);
v.top = new v(0, -1);
v.bottom = new v(0, 1);
v.topLeft = new v(-1, -1);
v.topRight = new v(1, -1);
v.bottomLeft = new v(-1, 1);
v.bottomRight = new v(1, 1);
class Q {
  static createSignal(t, e = Q.lerp) {
    return new hn(
      ["x", "y", "width", "height"],
      (r) => new Q(r),
      t,
      e
    ).toSignal();
  }
  static lerp(t, e, r) {
    let i, a, h, u;
    return (
      typeof r == "number"
        ? (i = a = h = u = r)
        : r instanceof v
        ? ((i = h = r.x), (a = u = r.y))
        : ((i = r.x), (a = r.y), (h = r.width), (u = r.height)),
      new Q(
        ot(t.x, e.x, i),
        ot(t.y, e.y, a),
        ot(t.width, e.width, h),
        ot(t.height, e.height, u)
      )
    );
  }
  static arcLerp(t, e, r, i = !1, a) {
    return (
      a ?? (a = (t.position.sub(e.position).ctg + t.size.sub(e.size).ctg) / 2),
      Q.lerp(t, e, na(r, i, a))
    );
  }
  static fromSizeCentered(t) {
    return new Q(-t.width / 2, -t.height / 2, t.width, t.height);
  }
  static fromPoints(...t) {
    let e = 1 / 0,
      r = 1 / 0,
      i = -1 / 0,
      a = -1 / 0;
    for (const h of t)
      h.x > i && (i = h.x),
        h.x < e && (e = h.x),
        h.y > a && (a = h.y),
        h.y < r && (r = h.y);
    return new Q(e, r, i - e, a - r);
  }
  static fromBBoxes(...t) {
    let e = 1 / 0,
      r = 1 / 0,
      i = -1 / 0,
      a = -1 / 0;
    for (const h of t) {
      const u = h.x + h.width;
      u > i && (i = u), h.x < e && (e = h.x);
      const g = h.y + h.height;
      g > a && (a = g), h.y < r && (r = h.y);
    }
    return new Q(e, r, i - e, a - r);
  }
  lerp(t, e) {
    return Q.lerp(this, t, e);
  }
  get position() {
    return new v(this.x, this.y);
  }
  set position(t) {
    (this.x = t.x), (this.y = t.y);
  }
  get size() {
    return new v(this.width, this.height);
  }
  get center() {
    return new v(this.x + this.width / 2, this.y + this.height / 2);
  }
  get left() {
    return this.x;
  }
  set left(t) {
    (this.width += this.x - t), (this.x = t);
  }
  get right() {
    return this.x + this.width;
  }
  set right(t) {
    this.width = t - this.x;
  }
  get top() {
    return this.y;
  }
  set top(t) {
    (this.height += this.y - t), (this.y = t);
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(t) {
    this.height = t - this.y;
  }
  get topLeft() {
    return this.position;
  }
  get topRight() {
    return new v(this.x + this.width, this.y);
  }
  get bottomLeft() {
    return new v(this.x, this.y + this.height);
  }
  get bottomRight() {
    return new v(this.x + this.width, this.y + this.height);
  }
  get corners() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }
  get pixelPerfect() {
    return new Q(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.ceil(this.width + 1),
      Math.ceil(this.height + 1)
    );
  }
  constructor(t, e = 0, r = 0, i = 0) {
    if (
      ((this.x = 0),
      (this.y = 0),
      (this.width = 0),
      (this.height = 0),
      t != null)
    ) {
      if (typeof t == "number") {
        (this.x = t), (this.y = e), (this.width = r), (this.height = i);
        return;
      }
      if (t instanceof v) {
        (this.x = t.x),
          (this.y = t.y),
          e instanceof v && ((this.width = e.x), (this.height = e.y));
        return;
      }
      if (Array.isArray(t)) {
        (this.x = t[0]),
          (this.y = t[1]),
          (this.width = t[2]),
          (this.height = t[3]);
        return;
      }
      (this.x = t.x),
        (this.y = t.y),
        (this.width = t.width),
        (this.height = t.height);
    }
  }
  transform(t) {
    return new Q(this.position.transformAsPoint(t), this.size.transform(t));
  }
  transformCorners(t) {
    return this.corners.map((e) => e.transformAsPoint(t));
  }
  expand(t) {
    const e = new Bt(t),
      r = new Q(this);
    return (
      (r.left -= e.left),
      (r.top -= e.top),
      (r.right += e.right),
      (r.bottom += e.bottom),
      r
    );
  }
  addSpacing(t) {
    return this.expand(t);
  }
  includes(t) {
    return (
      t.x >= this.x &&
      t.x <= this.x + this.width &&
      t.y >= this.y &&
      t.y <= this.y + this.height
    );
  }
  intersects(t) {
    return (
      this.left < t.right &&
      this.right > t.left &&
      this.top < t.bottom &&
      this.bottom > t.top
    );
  }
  intersection(t) {
    const e = new Q();
    return (
      this.intersects(t) &&
        ((e.left = Math.max(this.left, t.left)),
        (e.top = Math.max(this.top, t.top)),
        (e.right = Math.min(this.right, t.right)),
        (e.bottom = Math.min(this.bottom, t.bottom))),
      e
    );
  }
  union(t) {
    const e = new Q();
    return (
      (e.left = Math.min(this.left, t.left)),
      (e.top = Math.min(this.top, t.top)),
      (e.right = Math.max(this.right, t.right)),
      (e.bottom = Math.max(this.bottom, t.bottom)),
      e
    );
  }
  toSymbol() {
    return Q.symbol;
  }
  toString() {
    return `BBox(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.x, this.y, this.width, this.height);
  }
  serialize() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
Q.symbol = Symbol.for("@motion-canvas/core/types/Rect");
var ou =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : typeof self < "u"
      ? self
      : {},
  ia = { exports: {} };
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */ (function (n, t) {
  (function (e, r) {
    n.exports = r();
  })(ou, function () {
    for (
      var e = function (s, o, l) {
          return (
            o === void 0 && (o = 0),
            l === void 0 && (l = 1),
            s < o ? o : s > l ? l : s
          );
        },
        r = e,
        i = function (s) {
          (s._clipped = !1), (s._unclipped = s.slice(0));
          for (var o = 0; o <= 3; o++)
            o < 3
              ? ((s[o] < 0 || s[o] > 255) && (s._clipped = !0),
                (s[o] = r(s[o], 0, 255)))
              : o === 3 && (s[o] = r(s[o], 0, 1));
          return s;
        },
        a = {},
        h = 0,
        u = [
          "Boolean",
          "Number",
          "String",
          "Function",
          "Array",
          "Date",
          "RegExp",
          "Undefined",
          "Null",
        ];
      h < u.length;
      h += 1
    ) {
      var g = u[h];
      a["[object " + g + "]"] = g.toLowerCase();
    }
    var b = function (s) {
        return a[Object.prototype.toString.call(s)] || "object";
      },
      x = b,
      O = function (s, o) {
        return (
          o === void 0 && (o = null),
          s.length >= 3
            ? Array.prototype.slice.call(s)
            : x(s[0]) == "object" && o
            ? o
                .split("")
                .filter(function (l) {
                  return s[0][l] !== void 0;
                })
                .map(function (l) {
                  return s[0][l];
                })
            : s[0]
        );
      },
      N = b,
      Y = function (s) {
        if (s.length < 2) return null;
        var o = s.length - 1;
        return N(s[o]) == "string" ? s[o].toLowerCase() : null;
      },
      st = Math.PI,
      C = {
        clip_rgb: i,
        limit: e,
        type: b,
        unpack: O,
        last: Y,
        PI: st,
        TWOPI: st * 2,
        PITHIRD: st / 3,
        DEG2RAD: st / 180,
        RAD2DEG: 180 / st,
      },
      tt = { format: {}, autodetect: [] },
      vt = C.last,
      it = C.clip_rgb,
      It = C.type,
      Pt = tt,
      Ht = function () {
        for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
        var c = this;
        if (
          It(o[0]) === "object" &&
          o[0].constructor &&
          o[0].constructor === this.constructor
        )
          return o[0];
        var d = vt(o),
          p = !1;
        if (!d) {
          (p = !0),
            Pt.sorted ||
              ((Pt.autodetect = Pt.autodetect.sort(function (k, R) {
                return R.p - k.p;
              })),
              (Pt.sorted = !0));
          for (var f = 0, m = Pt.autodetect; f < m.length; f += 1) {
            var y = m[f];
            if (((d = y.test.apply(y, o)), d)) break;
          }
        }
        if (Pt.format[d]) {
          var w = Pt.format[d].apply(null, p ? o : o.slice(0, -1));
          c._rgb = it(w);
        } else throw new Error("unknown format: " + o);
        c._rgb.length === 3 && c._rgb.push(1);
      };
    Ht.prototype.toString = function () {
      return It(this.hex) == "function"
        ? this.hex()
        : "[" + this._rgb.join(",") + "]";
    };
    var j = Ht,
      Et = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Et.Color,
          [null].concat(s)
        ))();
      };
    (Et.Color = j), (Et.version = "2.4.2");
    var lt = Et,
      tr = C.unpack,
      Ee = Math.max,
      er = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = tr(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2];
        (c = c / 255), (d = d / 255), (p = p / 255);
        var f = 1 - Ee(c, Ee(d, p)),
          m = f < 1 ? 1 / (1 - f) : 0,
          y = (1 - c - f) * m,
          w = (1 - d - f) * m,
          k = (1 - p - f) * m;
        return [y, w, k, f];
      },
      rr = er,
      nr = C.unpack,
      sr = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = nr(s, "cmyk");
        var l = s[0],
          c = s[1],
          d = s[2],
          p = s[3],
          f = s.length > 4 ? s[4] : 1;
        return p === 1
          ? [0, 0, 0, f]
          : [
              l >= 1 ? 0 : 255 * (1 - l) * (1 - p),
              c >= 1 ? 0 : 255 * (1 - c) * (1 - p),
              d >= 1 ? 0 : 255 * (1 - d) * (1 - p),
              f,
            ];
      },
      ir = sr,
      ar = lt,
      je = j,
      _e = tt,
      or = C.unpack,
      lr = C.type,
      hr = rr;
    (je.prototype.cmyk = function () {
      return hr(this._rgb);
    }),
      (ar.cmyk = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          je,
          [null].concat(s, ["cmyk"])
        ))();
      }),
      (_e.format.cmyk = ir),
      _e.autodetect.push({
        p: 2,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = or(s, "cmyk")), lr(s) === "array" && s.length === 4))
            return "cmyk";
        },
      });
    var cr = C.unpack,
      ur = C.last,
      ke = function (s) {
        return Math.round(s * 100) / 100;
      },
      Or = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = cr(s, "hsla"),
          c = ur(s) || "lsa";
        return (
          (l[0] = ke(l[0] || 0)),
          (l[1] = ke(l[1] * 100) + "%"),
          (l[2] = ke(l[2] * 100) + "%"),
          c === "hsla" || (l.length > 3 && l[3] < 1)
            ? ((l[3] = l.length > 3 ? l[3] : 1), (c = "hsla"))
            : (l.length = 3),
          c + "(" + l.join(",") + ")"
        );
      },
      Fr = Or,
      Ir = C.unpack,
      Er = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = Ir(s, "rgba");
        var l = s[0],
          c = s[1],
          d = s[2];
        (l /= 255), (c /= 255), (d /= 255);
        var p = Math.min(l, c, d),
          f = Math.max(l, c, d),
          m = (f + p) / 2,
          y,
          w;
        return (
          f === p
            ? ((y = 0), (w = Number.NaN))
            : (y = m < 0.5 ? (f - p) / (f + p) : (f - p) / (2 - f - p)),
          l == f
            ? (w = (c - d) / (f - p))
            : c == f
            ? (w = 2 + (d - l) / (f - p))
            : d == f && (w = 4 + (l - c) / (f - p)),
          (w *= 60),
          w < 0 && (w += 360),
          s.length > 3 && s[3] !== void 0 ? [w, y, m, s[3]] : [w, y, m]
        );
      },
      fr = Er,
      jr = C.unpack,
      _r = C.last,
      Dr = Fr,
      Nr = fr,
      De = Math.round,
      Wr = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = jr(s, "rgba"),
          c = _r(s) || "rgb";
        return c.substr(0, 3) == "hsl"
          ? Dr(Nr(l), c)
          : ((l[0] = De(l[0])),
            (l[1] = De(l[1])),
            (l[2] = De(l[2])),
            (c === "rgba" || (l.length > 3 && l[3] < 1)) &&
              ((l[3] = l.length > 3 ? l[3] : 1), (c = "rgba")),
            c + "(" + l.slice(0, c === "rgb" ? 3 : 4).join(",") + ")");
      },
      ga = Wr,
      va = C.unpack,
      fn = Math.round,
      ma = function () {
        for (var s, o = [], l = arguments.length; l--; ) o[l] = arguments[l];
        o = va(o, "hsl");
        var c = o[0],
          d = o[1],
          p = o[2],
          f,
          m,
          y;
        if (d === 0) f = m = y = p * 255;
        else {
          var w = [0, 0, 0],
            k = [0, 0, 0],
            R = p < 0.5 ? p * (1 + d) : p + d - p * d,
            S = 2 * p - R,
            M = c / 360;
          (w[0] = M + 1 / 3), (w[1] = M), (w[2] = M - 1 / 3);
          for (var L = 0; L < 3; L++)
            w[L] < 0 && (w[L] += 1),
              w[L] > 1 && (w[L] -= 1),
              6 * w[L] < 1
                ? (k[L] = S + (R - S) * 6 * w[L])
                : 2 * w[L] < 1
                ? (k[L] = R)
                : 3 * w[L] < 2
                ? (k[L] = S + (R - S) * (2 / 3 - w[L]) * 6)
                : (k[L] = S);
          (s = [fn(k[0] * 255), fn(k[1] * 255), fn(k[2] * 255)]),
            (f = s[0]),
            (m = s[1]),
            (y = s[2]);
        }
        return o.length > 3 ? [f, m, y, o[3]] : [f, m, y, 1];
      },
      ls = ma,
      hs = ls,
      cs = tt,
      us = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/,
      fs =
        /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/,
      ds =
        /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,
      ps =
        /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,
      gs =
        /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,
      vs =
        /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,
      ms = Math.round,
      ys = function (s) {
        s = s.toLowerCase().trim();
        var o;
        if (cs.format.named)
          try {
            return cs.format.named(s);
          } catch {}
        if ((o = s.match(us))) {
          for (var l = o.slice(1, 4), c = 0; c < 3; c++) l[c] = +l[c];
          return (l[3] = 1), l;
        }
        if ((o = s.match(fs))) {
          for (var d = o.slice(1, 5), p = 0; p < 4; p++) d[p] = +d[p];
          return d;
        }
        if ((o = s.match(ds))) {
          for (var f = o.slice(1, 4), m = 0; m < 3; m++) f[m] = ms(f[m] * 2.55);
          return (f[3] = 1), f;
        }
        if ((o = s.match(ps))) {
          for (var y = o.slice(1, 5), w = 0; w < 3; w++) y[w] = ms(y[w] * 2.55);
          return (y[3] = +y[3]), y;
        }
        if ((o = s.match(gs))) {
          var k = o.slice(1, 4);
          (k[1] *= 0.01), (k[2] *= 0.01);
          var R = hs(k);
          return (R[3] = 1), R;
        }
        if ((o = s.match(vs))) {
          var S = o.slice(1, 4);
          (S[1] *= 0.01), (S[2] *= 0.01);
          var M = hs(S);
          return (M[3] = +o[4]), M;
        }
      };
    ys.test = function (s) {
      return (
        us.test(s) ||
        fs.test(s) ||
        ds.test(s) ||
        ps.test(s) ||
        gs.test(s) ||
        vs.test(s)
      );
    };
    var ya = ys,
      ba = lt,
      bs = j,
      ws = tt,
      wa = C.type,
      xa = ga,
      xs = ya;
    (bs.prototype.css = function (s) {
      return xa(this._rgb, s);
    }),
      (ba.css = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          bs,
          [null].concat(s, ["css"])
        ))();
      }),
      (ws.format.css = xs),
      ws.autodetect.push({
        p: 5,
        test: function (s) {
          for (var o = [], l = arguments.length - 1; l-- > 0; )
            o[l] = arguments[l + 1];
          if (!o.length && wa(s) === "string" && xs.test(s)) return "css";
        },
      });
    var ks = j,
      ka = lt,
      Sa = tt,
      Ta = C.unpack;
    (Sa.format.gl = function () {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Ta(s, "rgba");
      return (l[0] *= 255), (l[1] *= 255), (l[2] *= 255), l;
    }),
      (ka.gl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          ks,
          [null].concat(s, ["gl"])
        ))();
      }),
      (ks.prototype.gl = function () {
        var s = this._rgb;
        return [s[0] / 255, s[1] / 255, s[2] / 255, s[3]];
      });
    var Ca = C.unpack,
      Pa = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Ca(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = Math.min(c, d, p),
          m = Math.max(c, d, p),
          y = m - f,
          w = (y * 100) / 255,
          k = (f / (255 - y)) * 100,
          R;
        return (
          y === 0
            ? (R = Number.NaN)
            : (c === m && (R = (d - p) / y),
              d === m && (R = 2 + (p - c) / y),
              p === m && (R = 4 + (c - d) / y),
              (R *= 60),
              R < 0 && (R += 360)),
          [R, w, k]
        );
      },
      Ra = Pa,
      La = C.unpack,
      Ma = Math.floor,
      $a = function () {
        for (var s, o, l, c, d, p, f = [], m = arguments.length; m--; )
          f[m] = arguments[m];
        f = La(f, "hcg");
        var y = f[0],
          w = f[1],
          k = f[2],
          R,
          S,
          M;
        k = k * 255;
        var L = w * 255;
        if (w === 0) R = S = M = k;
        else {
          y === 360 && (y = 0),
            y > 360 && (y -= 360),
            y < 0 && (y += 360),
            (y /= 60);
          var U = Ma(y),
            X = y - U,
            V = k * (1 - w),
            K = V + L * (1 - X),
            xt = V + L * X,
            wt = V + L;
          switch (U) {
            case 0:
              (s = [wt, xt, V]), (R = s[0]), (S = s[1]), (M = s[2]);
              break;
            case 1:
              (o = [K, wt, V]), (R = o[0]), (S = o[1]), (M = o[2]);
              break;
            case 2:
              (l = [V, wt, xt]), (R = l[0]), (S = l[1]), (M = l[2]);
              break;
            case 3:
              (c = [V, K, wt]), (R = c[0]), (S = c[1]), (M = c[2]);
              break;
            case 4:
              (d = [xt, V, wt]), (R = d[0]), (S = d[1]), (M = d[2]);
              break;
            case 5:
              (p = [wt, V, K]), (R = p[0]), (S = p[1]), (M = p[2]);
              break;
          }
        }
        return [R, S, M, f.length > 3 ? f[3] : 1];
      },
      Aa = $a,
      za = C.unpack,
      Oa = C.type,
      Fa = lt,
      Ss = j,
      Ts = tt,
      Ia = Ra;
    (Ss.prototype.hcg = function () {
      return Ia(this._rgb);
    }),
      (Fa.hcg = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Ss,
          [null].concat(s, ["hcg"])
        ))();
      }),
      (Ts.format.hcg = Aa),
      Ts.autodetect.push({
        p: 1,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = za(s, "hcg")), Oa(s) === "array" && s.length === 3))
            return "hcg";
        },
      });
    var Ea = C.unpack,
      ja = C.last,
      Br = Math.round,
      _a = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Ea(s, "rgba"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = l[3],
          m = ja(s) || "auto";
        f === void 0 && (f = 1),
          m === "auto" && (m = f < 1 ? "rgba" : "rgb"),
          (c = Br(c)),
          (d = Br(d)),
          (p = Br(p));
        var y = (c << 16) | (d << 8) | p,
          w = "000000" + y.toString(16);
        w = w.substr(w.length - 6);
        var k = "0" + Br(f * 255).toString(16);
        switch (((k = k.substr(k.length - 2)), m.toLowerCase())) {
          case "rgba":
            return "#" + w + k;
          case "argb":
            return "#" + k + w;
          default:
            return "#" + w;
        }
      },
      Cs = _a,
      Da = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      Na = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/,
      Wa = function (s) {
        if (s.match(Da)) {
          (s.length === 4 || s.length === 7) && (s = s.substr(1)),
            s.length === 3 &&
              ((s = s.split("")),
              (s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]));
          var o = parseInt(s, 16),
            l = o >> 16,
            c = (o >> 8) & 255,
            d = o & 255;
          return [l, c, d, 1];
        }
        if (s.match(Na)) {
          (s.length === 5 || s.length === 9) && (s = s.substr(1)),
            s.length === 4 &&
              ((s = s.split("")),
              (s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]));
          var p = parseInt(s, 16),
            f = (p >> 24) & 255,
            m = (p >> 16) & 255,
            y = (p >> 8) & 255,
            w = Math.round(((p & 255) / 255) * 100) / 100;
          return [f, m, y, w];
        }
        throw new Error("unknown hex color: " + s);
      },
      Ps = Wa,
      Ba = lt,
      Rs = j,
      Ua = C.type,
      Ls = tt,
      qa = Cs;
    (Rs.prototype.hex = function (s) {
      return qa(this._rgb, s);
    }),
      (Ba.hex = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Rs,
          [null].concat(s, ["hex"])
        ))();
      }),
      (Ls.format.hex = Ps),
      Ls.autodetect.push({
        p: 4,
        test: function (s) {
          for (var o = [], l = arguments.length - 1; l-- > 0; )
            o[l] = arguments[l + 1];
          if (
            !o.length &&
            Ua(s) === "string" &&
            [3, 4, 5, 6, 7, 8, 9].indexOf(s.length) >= 0
          )
            return "hex";
        },
      });
    var Ga = C.unpack,
      Ms = C.TWOPI,
      Xa = Math.min,
      Ha = Math.sqrt,
      Ya = Math.acos,
      Za = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Ga(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2];
        (c /= 255), (d /= 255), (p /= 255);
        var f,
          m = Xa(c, d, p),
          y = (c + d + p) / 3,
          w = y > 0 ? 1 - m / y : 0;
        return (
          w === 0
            ? (f = NaN)
            : ((f = (c - d + (c - p)) / 2),
              (f /= Ha((c - d) * (c - d) + (c - p) * (d - p))),
              (f = Ya(f)),
              p > d && (f = Ms - f),
              (f /= Ms)),
          [f * 360, w, y]
        );
      },
      Va = Za,
      Ja = C.unpack,
      dn = C.limit,
      Ne = C.TWOPI,
      pn = C.PITHIRD,
      We = Math.cos,
      Qa = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = Ja(s, "hsi");
        var l = s[0],
          c = s[1],
          d = s[2],
          p,
          f,
          m;
        return (
          isNaN(l) && (l = 0),
          isNaN(c) && (c = 0),
          l > 360 && (l -= 360),
          l < 0 && (l += 360),
          (l /= 360),
          l < 1 / 3
            ? ((m = (1 - c) / 3),
              (p = (1 + (c * We(Ne * l)) / We(pn - Ne * l)) / 3),
              (f = 1 - (m + p)))
            : l < 2 / 3
            ? ((l -= 1 / 3),
              (p = (1 - c) / 3),
              (f = (1 + (c * We(Ne * l)) / We(pn - Ne * l)) / 3),
              (m = 1 - (p + f)))
            : ((l -= 2 / 3),
              (f = (1 - c) / 3),
              (m = (1 + (c * We(Ne * l)) / We(pn - Ne * l)) / 3),
              (p = 1 - (f + m))),
          (p = dn(d * p * 3)),
          (f = dn(d * f * 3)),
          (m = dn(d * m * 3)),
          [p * 255, f * 255, m * 255, s.length > 3 ? s[3] : 1]
        );
      },
      Ka = Qa,
      to = C.unpack,
      eo = C.type,
      ro = lt,
      $s = j,
      As = tt,
      no = Va;
    ($s.prototype.hsi = function () {
      return no(this._rgb);
    }),
      (ro.hsi = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          $s,
          [null].concat(s, ["hsi"])
        ))();
      }),
      (As.format.hsi = Ka),
      As.autodetect.push({
        p: 2,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = to(s, "hsi")), eo(s) === "array" && s.length === 3))
            return "hsi";
        },
      });
    var so = C.unpack,
      io = C.type,
      ao = lt,
      zs = j,
      Os = tt,
      oo = fr;
    (zs.prototype.hsl = function () {
      return oo(this._rgb);
    }),
      (ao.hsl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          zs,
          [null].concat(s, ["hsl"])
        ))();
      }),
      (Os.format.hsl = ls),
      Os.autodetect.push({
        p: 2,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = so(s, "hsl")), io(s) === "array" && s.length === 3))
            return "hsl";
        },
      });
    var lo = C.unpack,
      ho = Math.min,
      co = Math.max,
      uo = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = lo(s, "rgb");
        var l = s[0],
          c = s[1],
          d = s[2],
          p = ho(l, c, d),
          f = co(l, c, d),
          m = f - p,
          y,
          w,
          k;
        return (
          (k = f / 255),
          f === 0
            ? ((y = Number.NaN), (w = 0))
            : ((w = m / f),
              l === f && (y = (c - d) / m),
              c === f && (y = 2 + (d - l) / m),
              d === f && (y = 4 + (l - c) / m),
              (y *= 60),
              y < 0 && (y += 360)),
          [y, w, k]
        );
      },
      fo = uo,
      po = C.unpack,
      go = Math.floor,
      vo = function () {
        for (var s, o, l, c, d, p, f = [], m = arguments.length; m--; )
          f[m] = arguments[m];
        f = po(f, "hsv");
        var y = f[0],
          w = f[1],
          k = f[2],
          R,
          S,
          M;
        if (((k *= 255), w === 0)) R = S = M = k;
        else {
          y === 360 && (y = 0),
            y > 360 && (y -= 360),
            y < 0 && (y += 360),
            (y /= 60);
          var L = go(y),
            U = y - L,
            X = k * (1 - w),
            V = k * (1 - w * U),
            K = k * (1 - w * (1 - U));
          switch (L) {
            case 0:
              (s = [k, K, X]), (R = s[0]), (S = s[1]), (M = s[2]);
              break;
            case 1:
              (o = [V, k, X]), (R = o[0]), (S = o[1]), (M = o[2]);
              break;
            case 2:
              (l = [X, k, K]), (R = l[0]), (S = l[1]), (M = l[2]);
              break;
            case 3:
              (c = [X, V, k]), (R = c[0]), (S = c[1]), (M = c[2]);
              break;
            case 4:
              (d = [K, X, k]), (R = d[0]), (S = d[1]), (M = d[2]);
              break;
            case 5:
              (p = [k, X, V]), (R = p[0]), (S = p[1]), (M = p[2]);
              break;
          }
        }
        return [R, S, M, f.length > 3 ? f[3] : 1];
      },
      mo = vo,
      yo = C.unpack,
      bo = C.type,
      wo = lt,
      Fs = j,
      Is = tt,
      xo = fo;
    (Fs.prototype.hsv = function () {
      return xo(this._rgb);
    }),
      (wo.hsv = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Fs,
          [null].concat(s, ["hsv"])
        ))();
      }),
      (Is.format.hsv = mo),
      Is.autodetect.push({
        p: 2,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = yo(s, "hsv")), bo(s) === "array" && s.length === 3))
            return "hsv";
        },
      });
    var Ur = {
        Kn: 18,
        Xn: 0.95047,
        Yn: 1,
        Zn: 1.08883,
        t0: 0.137931034,
        t1: 0.206896552,
        t2: 0.12841855,
        t3: 0.008856452,
      },
      Be = Ur,
      ko = C.unpack,
      Es = Math.pow,
      So = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = ko(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = To(c, d, p),
          m = f[0],
          y = f[1],
          w = f[2],
          k = 116 * y - 16;
        return [k < 0 ? 0 : k, 500 * (m - y), 200 * (y - w)];
      },
      gn = function (s) {
        return (s /= 255) <= 0.04045 ? s / 12.92 : Es((s + 0.055) / 1.055, 2.4);
      },
      vn = function (s) {
        return s > Be.t3 ? Es(s, 1 / 3) : s / Be.t2 + Be.t0;
      },
      To = function (s, o, l) {
        (s = gn(s)), (o = gn(o)), (l = gn(l));
        var c = vn((0.4124564 * s + 0.3575761 * o + 0.1804375 * l) / Be.Xn),
          d = vn((0.2126729 * s + 0.7151522 * o + 0.072175 * l) / Be.Yn),
          p = vn((0.0193339 * s + 0.119192 * o + 0.9503041 * l) / Be.Zn);
        return [c, d, p];
      },
      js = So,
      Ue = Ur,
      Co = C.unpack,
      Po = Math.pow,
      Ro = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = Co(s, "lab");
        var l = s[0],
          c = s[1],
          d = s[2],
          p,
          f,
          m,
          y,
          w,
          k;
        return (
          (f = (l + 16) / 116),
          (p = isNaN(c) ? f : f + c / 500),
          (m = isNaN(d) ? f : f - d / 200),
          (f = Ue.Yn * yn(f)),
          (p = Ue.Xn * yn(p)),
          (m = Ue.Zn * yn(m)),
          (y = mn(3.2404542 * p - 1.5371385 * f - 0.4985314 * m)),
          (w = mn(-0.969266 * p + 1.8760108 * f + 0.041556 * m)),
          (k = mn(0.0556434 * p - 0.2040259 * f + 1.0572252 * m)),
          [y, w, k, s.length > 3 ? s[3] : 1]
        );
      },
      mn = function (s) {
        return (
          255 * (s <= 0.00304 ? 12.92 * s : 1.055 * Po(s, 1 / 2.4) - 0.055)
        );
      },
      yn = function (s) {
        return s > Ue.t1 ? s * s * s : Ue.t2 * (s - Ue.t0);
      },
      _s = Ro,
      Lo = C.unpack,
      Mo = C.type,
      $o = lt,
      Ds = j,
      Ns = tt,
      Ao = js;
    (Ds.prototype.lab = function () {
      return Ao(this._rgb);
    }),
      ($o.lab = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Ds,
          [null].concat(s, ["lab"])
        ))();
      }),
      (Ns.format.lab = _s),
      Ns.autodetect.push({
        p: 2,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = Lo(s, "lab")), Mo(s) === "array" && s.length === 3))
            return "lab";
        },
      });
    var zo = C.unpack,
      Oo = C.RAD2DEG,
      Fo = Math.sqrt,
      Io = Math.atan2,
      Eo = Math.round,
      jo = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = zo(s, "lab"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = Fo(d * d + p * p),
          m = (Io(p, d) * Oo + 360) % 360;
        return Eo(f * 1e4) === 0 && (m = Number.NaN), [c, f, m];
      },
      Ws = jo,
      _o = C.unpack,
      Do = js,
      No = Ws,
      Wo = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = _o(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = Do(c, d, p),
          m = f[0],
          y = f[1],
          w = f[2];
        return No(m, y, w);
      },
      Bo = Wo,
      Uo = C.unpack,
      qo = C.DEG2RAD,
      Go = Math.sin,
      Xo = Math.cos,
      Ho = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Uo(s, "lch"),
          c = l[0],
          d = l[1],
          p = l[2];
        return isNaN(p) && (p = 0), (p = p * qo), [c, Xo(p) * d, Go(p) * d];
      },
      Bs = Ho,
      Yo = C.unpack,
      Zo = Bs,
      Vo = _s,
      Jo = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = Yo(s, "lch");
        var l = s[0],
          c = s[1],
          d = s[2],
          p = Zo(l, c, d),
          f = p[0],
          m = p[1],
          y = p[2],
          w = Vo(f, m, y),
          k = w[0],
          R = w[1],
          S = w[2];
        return [k, R, S, s.length > 3 ? s[3] : 1];
      },
      Us = Jo,
      Qo = C.unpack,
      Ko = Us,
      tl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Qo(s, "hcl").reverse();
        return Ko.apply(void 0, l);
      },
      el = tl,
      rl = C.unpack,
      nl = C.type,
      qs = lt,
      qr = j,
      bn = tt,
      Gs = Bo;
    (qr.prototype.lch = function () {
      return Gs(this._rgb);
    }),
      (qr.prototype.hcl = function () {
        return Gs(this._rgb).reverse();
      }),
      (qs.lch = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          qr,
          [null].concat(s, ["lch"])
        ))();
      }),
      (qs.hcl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          qr,
          [null].concat(s, ["hcl"])
        ))();
      }),
      (bn.format.lch = Us),
      (bn.format.hcl = el),
      ["lch", "hcl"].forEach(function (s) {
        return bn.autodetect.push({
          p: 2,
          test: function () {
            for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
            if (((o = rl(o, s)), nl(o) === "array" && o.length === 3)) return s;
          },
        });
      });
    var sl = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflower: "#6495ed",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkgrey: "#a9a9a9",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkslategrey: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        laserlemon: "#ffff54",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrod: "#fafad2",
        lightgoldenrodyellow: "#fafad2",
        lightgray: "#d3d3d3",
        lightgreen: "#90ee90",
        lightgrey: "#d3d3d3",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        maroon2: "#7f0000",
        maroon3: "#b03060",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370db",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#db7093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        purple2: "#7f007f",
        purple3: "#a020f0",
        rebeccapurple: "#663399",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32",
      },
      Xs = sl,
      il = j,
      Hs = tt,
      al = C.type,
      dr = Xs,
      ol = Ps,
      ll = Cs;
    (il.prototype.name = function () {
      for (
        var s = ll(this._rgb, "rgb"), o = 0, l = Object.keys(dr);
        o < l.length;
        o += 1
      ) {
        var c = l[o];
        if (dr[c] === s) return c.toLowerCase();
      }
      return s;
    }),
      (Hs.format.named = function (s) {
        if (((s = s.toLowerCase()), dr[s])) return ol(dr[s]);
        throw new Error("unknown color name: " + s);
      }),
      Hs.autodetect.push({
        p: 5,
        test: function (s) {
          for (var o = [], l = arguments.length - 1; l-- > 0; )
            o[l] = arguments[l + 1];
          if (!o.length && al(s) === "string" && dr[s.toLowerCase()])
            return "named";
        },
      });
    var hl = C.unpack,
      cl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = hl(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2];
        return (c << 16) + (d << 8) + p;
      },
      ul = cl,
      fl = C.type,
      dl = function (s) {
        if (fl(s) == "number" && s >= 0 && s <= 16777215) {
          var o = s >> 16,
            l = (s >> 8) & 255,
            c = s & 255;
          return [o, l, c, 1];
        }
        throw new Error("unknown num color: " + s);
      },
      pl = dl,
      gl = lt,
      Ys = j,
      Zs = tt,
      vl = C.type,
      ml = ul;
    (Ys.prototype.num = function () {
      return ml(this._rgb);
    }),
      (gl.num = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          Ys,
          [null].concat(s, ["num"])
        ))();
      }),
      (Zs.format.num = pl),
      Zs.autodetect.push({
        p: 5,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (
            s.length === 1 &&
            vl(s[0]) === "number" &&
            s[0] >= 0 &&
            s[0] <= 16777215
          )
            return "num";
        },
      });
    var yl = lt,
      wn = j,
      Vs = tt,
      Js = C.unpack,
      Qs = C.type,
      Ks = Math.round;
    (wn.prototype.rgb = function (s) {
      return (
        s === void 0 && (s = !0),
        s === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(Ks)
      );
    }),
      (wn.prototype.rgba = function (s) {
        return (
          s === void 0 && (s = !0),
          this._rgb.slice(0, 4).map(function (o, l) {
            return l < 3 ? (s === !1 ? o : Ks(o)) : o;
          })
        );
      }),
      (yl.rgb = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          wn,
          [null].concat(s, ["rgb"])
        ))();
      }),
      (Vs.format.rgb = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Js(s, "rgba");
        return l[3] === void 0 && (l[3] = 1), l;
      }),
      Vs.autodetect.push({
        p: 3,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (
            ((s = Js(s, "rgba")),
            Qs(s) === "array" &&
              (s.length === 3 ||
                (s.length === 4 &&
                  Qs(s[3]) == "number" &&
                  s[3] >= 0 &&
                  s[3] <= 1)))
          )
            return "rgb";
        },
      });
    var Gr = Math.log,
      bl = function (s) {
        var o = s / 100,
          l,
          c,
          d;
        return (
          o < 66
            ? ((l = 255),
              (c =
                o < 6
                  ? 0
                  : -155.25485562709179 -
                    0.44596950469579133 * (c = o - 2) +
                    104.49216199393888 * Gr(c)),
              (d =
                o < 20
                  ? 0
                  : -254.76935184120902 +
                    0.8274096064007395 * (d = o - 10) +
                    115.67994401066147 * Gr(d)))
            : ((l =
                351.97690566805693 +
                0.114206453784165 * (l = o - 55) -
                40.25366309332127 * Gr(l)),
              (c =
                325.4494125711974 +
                0.07943456536662342 * (c = o - 50) -
                28.0852963507957 * Gr(c)),
              (d = 255)),
          [l, c, d, 1]
        );
      },
      ti = bl,
      wl = ti,
      xl = C.unpack,
      kl = Math.round,
      Sl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        for (
          var l = xl(s, "rgb"),
            c = l[0],
            d = l[2],
            p = 1e3,
            f = 4e4,
            m = 0.4,
            y;
          f - p > m;

        ) {
          y = (f + p) * 0.5;
          var w = wl(y);
          w[2] / w[0] >= d / c ? (f = y) : (p = y);
        }
        return kl(y);
      },
      Tl = Sl,
      xn = lt,
      Xr = j,
      kn = tt,
      Cl = Tl;
    (Xr.prototype.temp =
      Xr.prototype.kelvin =
      Xr.prototype.temperature =
        function () {
          return Cl(this._rgb);
        }),
      (xn.temp =
        xn.kelvin =
        xn.temperature =
          function () {
            for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
            return new (Function.prototype.bind.apply(
              Xr,
              [null].concat(s, ["temp"])
            ))();
          }),
      (kn.format.temp = kn.format.kelvin = kn.format.temperature = ti);
    var Pl = C.unpack,
      Sn = Math.cbrt,
      Rl = Math.pow,
      Ll = Math.sign,
      Ml = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = Pl(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = [Tn(c / 255), Tn(d / 255), Tn(p / 255)],
          m = f[0],
          y = f[1],
          w = f[2],
          k = Sn(0.4122214708 * m + 0.5363325363 * y + 0.0514459929 * w),
          R = Sn(0.2119034982 * m + 0.6806995451 * y + 0.1073969566 * w),
          S = Sn(0.0883024619 * m + 0.2817188376 * y + 0.6299787005 * w);
        return [
          0.2104542553 * k + 0.793617785 * R - 0.0040720468 * S,
          1.9779984951 * k - 2.428592205 * R + 0.4505937099 * S,
          0.0259040371 * k + 0.7827717662 * R - 0.808675766 * S,
        ];
      },
      ei = Ml;
    function Tn(s) {
      var o = Math.abs(s);
      return o < 0.04045
        ? s / 12.92
        : (Ll(s) || 1) * Rl((o + 0.055) / 1.055, 2.4);
    }
    var $l = C.unpack,
      Hr = Math.pow,
      Al = Math.sign,
      zl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = $l(s, "lab");
        var l = s[0],
          c = s[1],
          d = s[2],
          p = Hr(l + 0.3963377774 * c + 0.2158037573 * d, 3),
          f = Hr(l - 0.1055613458 * c - 0.0638541728 * d, 3),
          m = Hr(l - 0.0894841775 * c - 1.291485548 * d, 3);
        return [
          255 * Cn(4.0767416621 * p - 3.3077115913 * f + 0.2309699292 * m),
          255 * Cn(-1.2684380046 * p + 2.6097574011 * f - 0.3413193965 * m),
          255 * Cn(-0.0041960863 * p - 0.7034186147 * f + 1.707614701 * m),
          s.length > 3 ? s[3] : 1,
        ];
      },
      ri = zl;
    function Cn(s) {
      var o = Math.abs(s);
      return o > 0.0031308
        ? (Al(s) || 1) * (1.055 * Hr(o, 1 / 2.4) - 0.055)
        : s * 12.92;
    }
    var Ol = C.unpack,
      Fl = C.type,
      Il = lt,
      ni = j,
      si = tt,
      El = ei;
    (ni.prototype.oklab = function () {
      return El(this._rgb);
    }),
      (Il.oklab = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          ni,
          [null].concat(s, ["oklab"])
        ))();
      }),
      (si.format.oklab = ri),
      si.autodetect.push({
        p: 3,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = Ol(s, "oklab")), Fl(s) === "array" && s.length === 3))
            return "oklab";
        },
      });
    var jl = C.unpack,
      _l = ei,
      Dl = Ws,
      Nl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        var l = jl(s, "rgb"),
          c = l[0],
          d = l[1],
          p = l[2],
          f = _l(c, d, p),
          m = f[0],
          y = f[1],
          w = f[2];
        return Dl(m, y, w);
      },
      Wl = Nl,
      Bl = C.unpack,
      Ul = Bs,
      ql = ri,
      Gl = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        s = Bl(s, "lch");
        var l = s[0],
          c = s[1],
          d = s[2],
          p = Ul(l, c, d),
          f = p[0],
          m = p[1],
          y = p[2],
          w = ql(f, m, y),
          k = w[0],
          R = w[1],
          S = w[2];
        return [k, R, S, s.length > 3 ? s[3] : 1];
      },
      Xl = Gl,
      Hl = C.unpack,
      Yl = C.type,
      Zl = lt,
      ii = j,
      ai = tt,
      Vl = Wl;
    (ii.prototype.oklch = function () {
      return Vl(this._rgb);
    }),
      (Zl.oklch = function () {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        return new (Function.prototype.bind.apply(
          ii,
          [null].concat(s, ["oklch"])
        ))();
      }),
      (ai.format.oklch = Xl),
      ai.autodetect.push({
        p: 3,
        test: function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          if (((s = Hl(s, "oklch")), Yl(s) === "array" && s.length === 3))
            return "oklch";
        },
      });
    var oi = j,
      Jl = C.type;
    oi.prototype.alpha = function (s, o) {
      return (
        o === void 0 && (o = !1),
        s !== void 0 && Jl(s) === "number"
          ? o
            ? ((this._rgb[3] = s), this)
            : new oi([this._rgb[0], this._rgb[1], this._rgb[2], s], "rgb")
          : this._rgb[3]
      );
    };
    var Ql = j;
    Ql.prototype.clipped = function () {
      return this._rgb._clipped || !1;
    };
    var Se = j,
      Kl = Ur;
    (Se.prototype.darken = function (s) {
      s === void 0 && (s = 1);
      var o = this,
        l = o.lab();
      return (l[0] -= Kl.Kn * s), new Se(l, "lab").alpha(o.alpha(), !0);
    }),
      (Se.prototype.brighten = function (s) {
        return s === void 0 && (s = 1), this.darken(-s);
      }),
      (Se.prototype.darker = Se.prototype.darken),
      (Se.prototype.brighter = Se.prototype.brighten);
    var th = j;
    th.prototype.get = function (s) {
      var o = s.split("."),
        l = o[0],
        c = o[1],
        d = this[l]();
      if (c) {
        var p = l.indexOf(c) - (l.substr(0, 2) === "ok" ? 2 : 0);
        if (p > -1) return d[p];
        throw new Error("unknown channel " + c + " in mode " + l);
      } else return d;
    };
    var qe = j,
      eh = C.type,
      rh = Math.pow,
      nh = 1e-7,
      sh = 20;
    qe.prototype.luminance = function (s) {
      if (s !== void 0 && eh(s) === "number") {
        if (s === 0) return new qe([0, 0, 0, this._rgb[3]], "rgb");
        if (s === 1) return new qe([255, 255, 255, this._rgb[3]], "rgb");
        var o = this.luminance(),
          l = "rgb",
          c = sh,
          d = function (f, m) {
            var y = f.interpolate(m, 0.5, l),
              w = y.luminance();
            return Math.abs(s - w) < nh || !c-- ? y : w > s ? d(f, y) : d(y, m);
          },
          p = (
            o > s
              ? d(new qe([0, 0, 0]), this)
              : d(this, new qe([255, 255, 255]))
          ).rgb();
        return new qe(p.concat([this._rgb[3]]));
      }
      return ih.apply(void 0, this._rgb.slice(0, 3));
    };
    var ih = function (s, o, l) {
        return (
          (s = Pn(s)),
          (o = Pn(o)),
          (l = Pn(l)),
          0.2126 * s + 0.7152 * o + 0.0722 * l
        );
      },
      Pn = function (s) {
        return (
          (s /= 255), s <= 0.03928 ? s / 12.92 : rh((s + 0.055) / 1.055, 2.4)
        );
      },
      zt = {},
      li = j,
      hi = C.type,
      Yr = zt,
      ci = function (s, o, l) {
        l === void 0 && (l = 0.5);
        for (var c = [], d = arguments.length - 3; d-- > 0; )
          c[d] = arguments[d + 3];
        var p = c[0] || "lrgb";
        if ((!Yr[p] && !c.length && (p = Object.keys(Yr)[0]), !Yr[p]))
          throw new Error("interpolation mode " + p + " is not defined");
        return (
          hi(s) !== "object" && (s = new li(s)),
          hi(o) !== "object" && (o = new li(o)),
          Yr[p](s, o, l).alpha(s.alpha() + l * (o.alpha() - s.alpha()))
        );
      },
      ui = j,
      ah = ci;
    ui.prototype.mix = ui.prototype.interpolate = function (s, o) {
      o === void 0 && (o = 0.5);
      for (var l = [], c = arguments.length - 2; c-- > 0; )
        l[c] = arguments[c + 2];
      return ah.apply(void 0, [this, s, o].concat(l));
    };
    var fi = j;
    fi.prototype.premultiply = function (s) {
      s === void 0 && (s = !1);
      var o = this._rgb,
        l = o[3];
      return s
        ? ((this._rgb = [o[0] * l, o[1] * l, o[2] * l, l]), this)
        : new fi([o[0] * l, o[1] * l, o[2] * l, l], "rgb");
    };
    var Rn = j,
      oh = Ur;
    (Rn.prototype.saturate = function (s) {
      s === void 0 && (s = 1);
      var o = this,
        l = o.lch();
      return (
        (l[1] += oh.Kn * s),
        l[1] < 0 && (l[1] = 0),
        new Rn(l, "lch").alpha(o.alpha(), !0)
      );
    }),
      (Rn.prototype.desaturate = function (s) {
        return s === void 0 && (s = 1), this.saturate(-s);
      });
    var di = j,
      pi = C.type;
    di.prototype.set = function (s, o, l) {
      l === void 0 && (l = !1);
      var c = s.split("."),
        d = c[0],
        p = c[1],
        f = this[d]();
      if (p) {
        var m = d.indexOf(p) - (d.substr(0, 2) === "ok" ? 2 : 0);
        if (m > -1) {
          if (pi(o) == "string")
            switch (o.charAt(0)) {
              case "+":
                f[m] += +o;
                break;
              case "-":
                f[m] += +o;
                break;
              case "*":
                f[m] *= +o.substr(1);
                break;
              case "/":
                f[m] /= +o.substr(1);
                break;
              default:
                f[m] = +o;
            }
          else if (pi(o) === "number") f[m] = o;
          else throw new Error("unsupported value for Color.set");
          var y = new di(f, d);
          return l ? ((this._rgb = y._rgb), this) : y;
        }
        throw new Error("unknown channel " + p + " in mode " + d);
      } else return f;
    };
    var lh = j,
      hh = function (s, o, l) {
        var c = s._rgb,
          d = o._rgb;
        return new lh(
          c[0] + l * (d[0] - c[0]),
          c[1] + l * (d[1] - c[1]),
          c[2] + l * (d[2] - c[2]),
          "rgb"
        );
      };
    zt.rgb = hh;
    var ch = j,
      Ln = Math.sqrt,
      Ge = Math.pow,
      uh = function (s, o, l) {
        var c = s._rgb,
          d = c[0],
          p = c[1],
          f = c[2],
          m = o._rgb,
          y = m[0],
          w = m[1],
          k = m[2];
        return new ch(
          Ln(Ge(d, 2) * (1 - l) + Ge(y, 2) * l),
          Ln(Ge(p, 2) * (1 - l) + Ge(w, 2) * l),
          Ln(Ge(f, 2) * (1 - l) + Ge(k, 2) * l),
          "rgb"
        );
      };
    zt.lrgb = uh;
    var fh = j,
      dh = function (s, o, l) {
        var c = s.lab(),
          d = o.lab();
        return new fh(
          c[0] + l * (d[0] - c[0]),
          c[1] + l * (d[1] - c[1]),
          c[2] + l * (d[2] - c[2]),
          "lab"
        );
      };
    zt.lab = dh;
    var gi = j,
      Xe = function (s, o, l, c) {
        var d, p, f, m;
        c === "hsl"
          ? ((f = s.hsl()), (m = o.hsl()))
          : c === "hsv"
          ? ((f = s.hsv()), (m = o.hsv()))
          : c === "hcg"
          ? ((f = s.hcg()), (m = o.hcg()))
          : c === "hsi"
          ? ((f = s.hsi()), (m = o.hsi()))
          : c === "lch" || c === "hcl"
          ? ((c = "hcl"), (f = s.hcl()), (m = o.hcl()))
          : c === "oklch" &&
            ((f = s.oklch().reverse()), (m = o.oklch().reverse()));
        var y, w, k, R, S, M;
        (c.substr(0, 1) === "h" || c === "oklch") &&
          ((d = f),
          (y = d[0]),
          (k = d[1]),
          (S = d[2]),
          (p = m),
          (w = p[0]),
          (R = p[1]),
          (M = p[2]));
        var L, U, X, V;
        return (
          !isNaN(y) && !isNaN(w)
            ? (w > y && w - y > 180
                ? (V = w - (y + 360))
                : w < y && y - w > 180
                ? (V = w + 360 - y)
                : (V = w - y),
              (U = y + l * V))
            : isNaN(y)
            ? isNaN(w)
              ? (U = Number.NaN)
              : ((U = w), (S == 1 || S == 0) && c != "hsv" && (L = R))
            : ((U = y), (M == 1 || M == 0) && c != "hsv" && (L = k)),
          L === void 0 && (L = k + l * (R - k)),
          (X = S + l * (M - S)),
          c === "oklch" ? new gi([X, L, U], c) : new gi([U, L, X], c)
        );
      },
      ph = Xe,
      vi = function (s, o, l) {
        return ph(s, o, l, "lch");
      };
    (zt.lch = vi), (zt.hcl = vi);
    var gh = j,
      vh = function (s, o, l) {
        var c = s.num(),
          d = o.num();
        return new gh(c + l * (d - c), "num");
      };
    zt.num = vh;
    var mh = Xe,
      yh = function (s, o, l) {
        return mh(s, o, l, "hcg");
      };
    zt.hcg = yh;
    var bh = Xe,
      wh = function (s, o, l) {
        return bh(s, o, l, "hsi");
      };
    zt.hsi = wh;
    var xh = Xe,
      kh = function (s, o, l) {
        return xh(s, o, l, "hsl");
      };
    zt.hsl = kh;
    var Sh = Xe,
      Th = function (s, o, l) {
        return Sh(s, o, l, "hsv");
      };
    zt.hsv = Th;
    var Ch = j,
      Ph = function (s, o, l) {
        var c = s.oklab(),
          d = o.oklab();
        return new Ch(
          c[0] + l * (d[0] - c[0]),
          c[1] + l * (d[1] - c[1]),
          c[2] + l * (d[2] - c[2]),
          "oklab"
        );
      };
    zt.oklab = Ph;
    var Rh = Xe,
      Lh = function (s, o, l) {
        return Rh(s, o, l, "oklch");
      };
    zt.oklch = Lh;
    var Mn = j,
      Mh = C.clip_rgb,
      $n = Math.pow,
      An = Math.sqrt,
      zn = Math.PI,
      mi = Math.cos,
      yi = Math.sin,
      $h = Math.atan2,
      Ah = function (s, o, l) {
        o === void 0 && (o = "lrgb"), l === void 0 && (l = null);
        var c = s.length;
        l ||
          (l = Array.from(new Array(c)).map(function () {
            return 1;
          }));
        var d =
          c /
          l.reduce(function (U, X) {
            return U + X;
          });
        if (
          (l.forEach(function (U, X) {
            l[X] *= d;
          }),
          (s = s.map(function (U) {
            return new Mn(U);
          })),
          o === "lrgb")
        )
          return zh(s, l);
        for (
          var p = s.shift(), f = p.get(o), m = [], y = 0, w = 0, k = 0;
          k < f.length;
          k++
        )
          if (
            ((f[k] = (f[k] || 0) * l[0]),
            m.push(isNaN(f[k]) ? 0 : l[0]),
            o.charAt(k) === "h" && !isNaN(f[k]))
          ) {
            var R = (f[k] / 180) * zn;
            (y += mi(R) * l[0]), (w += yi(R) * l[0]);
          }
        var S = p.alpha() * l[0];
        s.forEach(function (U, X) {
          var V = U.get(o);
          S += U.alpha() * l[X + 1];
          for (var K = 0; K < f.length; K++)
            if (!isNaN(V[K]))
              if (((m[K] += l[X + 1]), o.charAt(K) === "h")) {
                var xt = (V[K] / 180) * zn;
                (y += mi(xt) * l[X + 1]), (w += yi(xt) * l[X + 1]);
              } else f[K] += V[K] * l[X + 1];
        });
        for (var M = 0; M < f.length; M++)
          if (o.charAt(M) === "h") {
            for (var L = ($h(w / m[M], y / m[M]) / zn) * 180; L < 0; ) L += 360;
            for (; L >= 360; ) L -= 360;
            f[M] = L;
          } else f[M] = f[M] / m[M];
        return (S /= c), new Mn(f, o).alpha(S > 0.99999 ? 1 : S, !0);
      },
      zh = function (s, o) {
        for (var l = s.length, c = [0, 0, 0, 0], d = 0; d < s.length; d++) {
          var p = s[d],
            f = o[d] / l,
            m = p._rgb;
          (c[0] += $n(m[0], 2) * f),
            (c[1] += $n(m[1], 2) * f),
            (c[2] += $n(m[2], 2) * f),
            (c[3] += m[3] * f);
        }
        return (
          (c[0] = An(c[0])),
          (c[1] = An(c[1])),
          (c[2] = An(c[2])),
          c[3] > 0.9999999 && (c[3] = 1),
          new Mn(Mh(c))
        );
      },
      _t = lt,
      He = C.type,
      Oh = Math.pow,
      On = function (s) {
        var o = "rgb",
          l = _t("#ccc"),
          c = 0,
          d = [0, 1],
          p = [],
          f = [0, 0],
          m = !1,
          y = [],
          w = !1,
          k = 0,
          R = 1,
          S = !1,
          M = {},
          L = !0,
          U = 1,
          X = function (T) {
            if (
              ((T = T || ["#fff", "#000"]),
              T &&
                He(T) === "string" &&
                _t.brewer &&
                _t.brewer[T.toLowerCase()] &&
                (T = _t.brewer[T.toLowerCase()]),
              He(T) === "array")
            ) {
              T.length === 1 && (T = [T[0], T[0]]), (T = T.slice(0));
              for (var I = 0; I < T.length; I++) T[I] = _t(T[I]);
              p.length = 0;
              for (var G = 0; G < T.length; G++) p.push(G / (T.length - 1));
            }
            return Mt(), (y = T);
          },
          V = function (T) {
            if (m != null) {
              for (var I = m.length - 1, G = 0; G < I && T >= m[G]; ) G++;
              return G - 1;
            }
            return 0;
          },
          K = function (T) {
            return T;
          },
          xt = function (T) {
            return T;
          },
          wt = function (T, I) {
            var G, q;
            if ((I == null && (I = !1), isNaN(T) || T === null)) return l;
            if (I) q = T;
            else if (m && m.length > 2) {
              var kt = V(T);
              q = kt / (m.length - 2);
            } else R !== k ? (q = (T - k) / (R - k)) : (q = 1);
            (q = xt(q)),
              I || (q = K(q)),
              U !== 1 && (q = Oh(q, U)),
              (q = f[0] + q * (1 - f[0] - f[1])),
              (q = Math.min(1, Math.max(0, q)));
            var at = Math.floor(q * 1e4);
            if (L && M[at]) G = M[at];
            else {
              if (He(y) === "array")
                for (var J = 0; J < p.length; J++) {
                  var et = p[J];
                  if (q <= et) {
                    G = y[J];
                    break;
                  }
                  if (q >= et && J === p.length - 1) {
                    G = y[J];
                    break;
                  }
                  if (q > et && q < p[J + 1]) {
                    (q = (q - et) / (p[J + 1] - et)),
                      (G = _t.interpolate(y[J], y[J + 1], q, o));
                    break;
                  }
                }
              else He(y) === "function" && (G = y(q));
              L && (M[at] = G);
            }
            return G;
          },
          Mt = function () {
            return (M = {});
          };
        X(s);
        var Z = function (T) {
          var I = _t(wt(T));
          return w && I[w] ? I[w]() : I;
        };
        return (
          (Z.classes = function (T) {
            if (T != null) {
              if (He(T) === "array") (m = T), (d = [T[0], T[T.length - 1]]);
              else {
                var I = _t.analyze(d);
                T === 0 ? (m = [I.min, I.max]) : (m = _t.limits(I, "e", T));
              }
              return Z;
            }
            return m;
          }),
          (Z.domain = function (T) {
            if (!arguments.length) return d;
            (k = T[0]), (R = T[T.length - 1]), (p = []);
            var I = y.length;
            if (T.length === I && k !== R)
              for (var G = 0, q = Array.from(T); G < q.length; G += 1) {
                var kt = q[G];
                p.push((kt - k) / (R - k));
              }
            else {
              for (var at = 0; at < I; at++) p.push(at / (I - 1));
              if (T.length > 2) {
                var J = T.map(function (rt, nt) {
                    return nt / (T.length - 1);
                  }),
                  et = T.map(function (rt) {
                    return (rt - k) / (R - k);
                  });
                et.every(function (rt, nt) {
                  return J[nt] === rt;
                }) ||
                  (xt = function (rt) {
                    if (rt <= 0 || rt >= 1) return rt;
                    for (var nt = 0; rt >= et[nt + 1]; ) nt++;
                    var Nt = (rt - et[nt]) / (et[nt + 1] - et[nt]),
                      ce = J[nt] + Nt * (J[nt + 1] - J[nt]);
                    return ce;
                  });
              }
            }
            return (d = [k, R]), Z;
          }),
          (Z.mode = function (T) {
            return arguments.length ? ((o = T), Mt(), Z) : o;
          }),
          (Z.range = function (T, I) {
            return X(T), Z;
          }),
          (Z.out = function (T) {
            return (w = T), Z;
          }),
          (Z.spread = function (T) {
            return arguments.length ? ((c = T), Z) : c;
          }),
          (Z.correctLightness = function (T) {
            return (
              T == null && (T = !0),
              (S = T),
              Mt(),
              S
                ? (K = function (I) {
                    for (
                      var G = wt(0, !0).lab()[0],
                        q = wt(1, !0).lab()[0],
                        kt = G > q,
                        at = wt(I, !0).lab()[0],
                        J = G + (q - G) * I,
                        et = at - J,
                        rt = 0,
                        nt = 1,
                        Nt = 20;
                      Math.abs(et) > 0.01 && Nt-- > 0;

                    )
                      (function () {
                        return (
                          kt && (et *= -1),
                          et < 0
                            ? ((rt = I), (I += (nt - I) * 0.5))
                            : ((nt = I), (I += (rt - I) * 0.5)),
                          (at = wt(I, !0).lab()[0]),
                          (et = at - J)
                        );
                      })();
                    return I;
                  })
                : (K = function (I) {
                    return I;
                  }),
              Z
            );
          }),
          (Z.padding = function (T) {
            return T != null
              ? (He(T) === "number" && (T = [T, T]), (f = T), Z)
              : f;
          }),
          (Z.colors = function (T, I) {
            arguments.length < 2 && (I = "hex");
            var G = [];
            if (arguments.length === 0) G = y.slice(0);
            else if (T === 1) G = [Z(0.5)];
            else if (T > 1) {
              var q = d[0],
                kt = d[1] - q;
              G = Fh(0, T, !1).map(function (nt) {
                return Z(q + (nt / (T - 1)) * kt);
              });
            } else {
              s = [];
              var at = [];
              if (m && m.length > 2)
                for (
                  var J = 1, et = m.length, rt = 1 <= et;
                  rt ? J < et : J > et;
                  rt ? J++ : J--
                )
                  at.push((m[J - 1] + m[J]) * 0.5);
              else at = d;
              G = at.map(function (nt) {
                return Z(nt);
              });
            }
            return (
              _t[I] &&
                (G = G.map(function (nt) {
                  return nt[I]();
                })),
              G
            );
          }),
          (Z.cache = function (T) {
            return T != null ? ((L = T), Z) : L;
          }),
          (Z.gamma = function (T) {
            return T != null ? ((U = T), Z) : U;
          }),
          (Z.nodata = function (T) {
            return T != null ? ((l = _t(T)), Z) : l;
          }),
          Z
        );
      };
    function Fh(s, o, l) {
      for (
        var c = [], d = s < o, p = l ? (d ? o + 1 : o - 1) : o, f = s;
        d ? f < p : f > p;
        d ? f++ : f--
      )
        c.push(f);
      return c;
    }
    var pr = j,
      Ih = On,
      Eh = function (s) {
        for (var o = [1, 1], l = 1; l < s; l++) {
          for (var c = [1], d = 1; d <= o.length; d++)
            c[d] = (o[d] || 0) + o[d - 1];
          o = c;
        }
        return o;
      },
      jh = function (s) {
        var o, l, c, d, p, f, m;
        if (
          ((s = s.map(function (S) {
            return new pr(S);
          })),
          s.length === 2)
        )
          (o = s.map(function (S) {
            return S.lab();
          })),
            (p = o[0]),
            (f = o[1]),
            (d = function (S) {
              var M = [0, 1, 2].map(function (L) {
                return p[L] + S * (f[L] - p[L]);
              });
              return new pr(M, "lab");
            });
        else if (s.length === 3)
          (l = s.map(function (S) {
            return S.lab();
          })),
            (p = l[0]),
            (f = l[1]),
            (m = l[2]),
            (d = function (S) {
              var M = [0, 1, 2].map(function (L) {
                return (
                  (1 - S) * (1 - S) * p[L] +
                  2 * (1 - S) * S * f[L] +
                  S * S * m[L]
                );
              });
              return new pr(M, "lab");
            });
        else if (s.length === 4) {
          var y;
          (c = s.map(function (S) {
            return S.lab();
          })),
            (p = c[0]),
            (f = c[1]),
            (m = c[2]),
            (y = c[3]),
            (d = function (S) {
              var M = [0, 1, 2].map(function (L) {
                return (
                  (1 - S) * (1 - S) * (1 - S) * p[L] +
                  3 * (1 - S) * (1 - S) * S * f[L] +
                  3 * (1 - S) * S * S * m[L] +
                  S * S * S * y[L]
                );
              });
              return new pr(M, "lab");
            });
        } else if (s.length >= 5) {
          var w, k, R;
          (w = s.map(function (S) {
            return S.lab();
          })),
            (R = s.length - 1),
            (k = Eh(R)),
            (d = function (S) {
              var M = 1 - S,
                L = [0, 1, 2].map(function (U) {
                  return w.reduce(function (X, V, K) {
                    return (
                      X + k[K] * Math.pow(M, R - K) * Math.pow(S, K) * V[U]
                    );
                  }, 0);
                });
              return new pr(L, "lab");
            });
        } else
          throw new RangeError(
            "No point in running bezier with only one color."
          );
        return d;
      },
      _h = function (s) {
        var o = jh(s);
        return (
          (o.scale = function () {
            return Ih(o);
          }),
          o
        );
      },
      Fn = lt,
      Dt = function (s, o, l) {
        if (!Dt[l]) throw new Error("unknown blend mode " + l);
        return Dt[l](s, o);
      },
      le = function (s) {
        return function (o, l) {
          var c = Fn(l).rgb(),
            d = Fn(o).rgb();
          return Fn.rgb(s(c, d));
        };
      },
      he = function (s) {
        return function (o, l) {
          var c = [];
          return (
            (c[0] = s(o[0], l[0])),
            (c[1] = s(o[1], l[1])),
            (c[2] = s(o[2], l[2])),
            c
          );
        };
      },
      Dh = function (s) {
        return s;
      },
      Nh = function (s, o) {
        return (s * o) / 255;
      },
      Wh = function (s, o) {
        return s > o ? o : s;
      },
      Bh = function (s, o) {
        return s > o ? s : o;
      },
      Uh = function (s, o) {
        return 255 * (1 - (1 - s / 255) * (1 - o / 255));
      },
      qh = function (s, o) {
        return o < 128
          ? (2 * s * o) / 255
          : 255 * (1 - 2 * (1 - s / 255) * (1 - o / 255));
      },
      Gh = function (s, o) {
        return 255 * (1 - (1 - o / 255) / (s / 255));
      },
      Xh = function (s, o) {
        return s === 255
          ? 255
          : ((s = (255 * (o / 255)) / (1 - s / 255)), s > 255 ? 255 : s);
      };
    (Dt.normal = le(he(Dh))),
      (Dt.multiply = le(he(Nh))),
      (Dt.screen = le(he(Uh))),
      (Dt.overlay = le(he(qh))),
      (Dt.darken = le(he(Wh))),
      (Dt.lighten = le(he(Bh))),
      (Dt.dodge = le(he(Xh))),
      (Dt.burn = le(he(Gh)));
    for (
      var Hh = Dt,
        In = C.type,
        Yh = C.clip_rgb,
        Zh = C.TWOPI,
        Vh = Math.pow,
        Jh = Math.sin,
        Qh = Math.cos,
        bi = lt,
        Kh = function (s, o, l, c, d) {
          s === void 0 && (s = 300),
            o === void 0 && (o = -1.5),
            l === void 0 && (l = 1),
            c === void 0 && (c = 1),
            d === void 0 && (d = [0, 1]);
          var p = 0,
            f;
          In(d) === "array" ? (f = d[1] - d[0]) : ((f = 0), (d = [d, d]));
          var m = function (y) {
            var w = Zh * ((s + 120) / 360 + o * y),
              k = Vh(d[0] + f * y, c),
              R = p !== 0 ? l[0] + y * p : l,
              S = (R * k * (1 - k)) / 2,
              M = Qh(w),
              L = Jh(w),
              U = k + S * (-0.14861 * M + 1.78277 * L),
              X = k + S * (-0.29227 * M - 0.90649 * L),
              V = k + S * (1.97294 * M);
            return bi(Yh([U * 255, X * 255, V * 255, 1]));
          };
          return (
            (m.start = function (y) {
              return y == null ? s : ((s = y), m);
            }),
            (m.rotations = function (y) {
              return y == null ? o : ((o = y), m);
            }),
            (m.gamma = function (y) {
              return y == null ? c : ((c = y), m);
            }),
            (m.hue = function (y) {
              return y == null
                ? l
                : ((l = y),
                  In(l) === "array"
                    ? ((p = l[1] - l[0]), p === 0 && (l = l[1]))
                    : (p = 0),
                  m);
            }),
            (m.lightness = function (y) {
              return y == null
                ? d
                : (In(y) === "array"
                    ? ((d = y), (f = y[1] - y[0]))
                    : ((d = [y, y]), (f = 0)),
                  m);
            }),
            (m.scale = function () {
              return bi.scale(m);
            }),
            m.hue(l),
            m
          );
        },
        tc = j,
        ec = "0123456789abcdef",
        rc = Math.floor,
        nc = Math.random,
        sc = function () {
          for (var s = "#", o = 0; o < 6; o++) s += ec.charAt(rc(nc() * 16));
          return new tc(s, "hex");
        },
        En = b,
        wi = Math.log,
        ic = Math.pow,
        ac = Math.floor,
        oc = Math.abs,
        xi = function (s, o) {
          o === void 0 && (o = null);
          var l = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE * -1,
            sum: 0,
            values: [],
            count: 0,
          };
          return (
            En(s) === "object" && (s = Object.values(s)),
            s.forEach(function (c) {
              o && En(c) === "object" && (c = c[o]),
                c != null &&
                  !isNaN(c) &&
                  (l.values.push(c),
                  (l.sum += c),
                  c < l.min && (l.min = c),
                  c > l.max && (l.max = c),
                  (l.count += 1));
            }),
            (l.domain = [l.min, l.max]),
            (l.limits = function (c, d) {
              return ki(l, c, d);
            }),
            l
          );
        },
        ki = function (s, o, l) {
          o === void 0 && (o = "equal"),
            l === void 0 && (l = 7),
            En(s) == "array" && (s = xi(s));
          var c = s.min,
            d = s.max,
            p = s.values.sort(function (_n, Dn) {
              return _n - Dn;
            });
          if (l === 1) return [c, d];
          var f = [];
          if (
            (o.substr(0, 1) === "c" && (f.push(c), f.push(d)),
            o.substr(0, 1) === "e")
          ) {
            f.push(c);
            for (var m = 1; m < l; m++) f.push(c + (m / l) * (d - c));
            f.push(d);
          } else if (o.substr(0, 1) === "l") {
            if (c <= 0)
              throw new Error(
                "Logarithmic scales are only possible for values > 0"
              );
            var y = Math.LOG10E * wi(c),
              w = Math.LOG10E * wi(d);
            f.push(c);
            for (var k = 1; k < l; k++) f.push(ic(10, y + (k / l) * (w - y)));
            f.push(d);
          } else if (o.substr(0, 1) === "q") {
            f.push(c);
            for (var R = 1; R < l; R++) {
              var S = ((p.length - 1) * R) / l,
                M = ac(S);
              if (M === S) f.push(p[M]);
              else {
                var L = S - M;
                f.push(p[M] * (1 - L) + p[M + 1] * L);
              }
            }
            f.push(d);
          } else if (o.substr(0, 1) === "k") {
            var U,
              X = p.length,
              V = new Array(X),
              K = new Array(l),
              xt = !0,
              wt = 0,
              Mt = null;
            (Mt = []), Mt.push(c);
            for (var Z = 1; Z < l; Z++) Mt.push(c + (Z / l) * (d - c));
            for (Mt.push(d); xt; ) {
              for (var T = 0; T < l; T++) K[T] = 0;
              for (var I = 0; I < X; I++)
                for (
                  var G = p[I], q = Number.MAX_VALUE, kt = void 0, at = 0;
                  at < l;
                  at++
                ) {
                  var J = oc(Mt[at] - G);
                  J < q && ((q = J), (kt = at)), K[kt]++, (V[I] = kt);
                }
              for (var et = new Array(l), rt = 0; rt < l; rt++) et[rt] = null;
              for (var nt = 0; nt < X; nt++)
                (U = V[nt]),
                  et[U] === null ? (et[U] = p[nt]) : (et[U] += p[nt]);
              for (var Nt = 0; Nt < l; Nt++) et[Nt] *= 1 / K[Nt];
              xt = !1;
              for (var ce = 0; ce < l; ce++)
                if (et[ce] !== Mt[ce]) {
                  xt = !0;
                  break;
                }
              (Mt = et), wt++, wt > 200 && (xt = !1);
            }
            for (var ue = {}, Ye = 0; Ye < l; Ye++) ue[Ye] = [];
            for (var Ze = 0; Ze < X; Ze++) (U = V[Ze]), ue[U].push(p[Ze]);
            for (var te = [], Te = 0; Te < l; Te++)
              te.push(ue[Te][0]), te.push(ue[Te][ue[Te].length - 1]);
            (te = te.sort(function (_n, Dn) {
              return _n - Dn;
            })),
              f.push(te[0]);
            for (var gr = 1; gr < te.length; gr += 2) {
              var Ce = te[gr];
              !isNaN(Ce) && f.indexOf(Ce) === -1 && f.push(Ce);
            }
          }
          return f;
        },
        Si = { analyze: xi, limits: ki },
        Ti = j,
        lc = function (s, o) {
          (s = new Ti(s)), (o = new Ti(o));
          var l = s.luminance(),
            c = o.luminance();
          return l > c ? (l + 0.05) / (c + 0.05) : (c + 0.05) / (l + 0.05);
        },
        Ci = j,
        Kt = Math.sqrt,
        pt = Math.pow,
        hc = Math.min,
        cc = Math.max,
        Pi = Math.atan2,
        Ri = Math.abs,
        Zr = Math.cos,
        Li = Math.sin,
        uc = Math.exp,
        Mi = Math.PI,
        fc = function (s, o, l, c, d) {
          l === void 0 && (l = 1),
            c === void 0 && (c = 1),
            d === void 0 && (d = 1);
          var p = function (Ce) {
              return (360 * Ce) / (2 * Mi);
            },
            f = function (Ce) {
              return (2 * Mi * Ce) / 360;
            };
          (s = new Ci(s)), (o = new Ci(o));
          var m = Array.from(s.lab()),
            y = m[0],
            w = m[1],
            k = m[2],
            R = Array.from(o.lab()),
            S = R[0],
            M = R[1],
            L = R[2],
            U = (y + S) / 2,
            X = Kt(pt(w, 2) + pt(k, 2)),
            V = Kt(pt(M, 2) + pt(L, 2)),
            K = (X + V) / 2,
            xt = 0.5 * (1 - Kt(pt(K, 7) / (pt(K, 7) + pt(25, 7)))),
            wt = w * (1 + xt),
            Mt = M * (1 + xt),
            Z = Kt(pt(wt, 2) + pt(k, 2)),
            T = Kt(pt(Mt, 2) + pt(L, 2)),
            I = (Z + T) / 2,
            G = p(Pi(k, wt)),
            q = p(Pi(L, Mt)),
            kt = G >= 0 ? G : G + 360,
            at = q >= 0 ? q : q + 360,
            J = Ri(kt - at) > 180 ? (kt + at + 360) / 2 : (kt + at) / 2,
            et =
              1 -
              0.17 * Zr(f(J - 30)) +
              0.24 * Zr(f(2 * J)) +
              0.32 * Zr(f(3 * J + 6)) -
              0.2 * Zr(f(4 * J - 63)),
            rt = at - kt;
          (rt = Ri(rt) <= 180 ? rt : at <= kt ? rt + 360 : rt - 360),
            (rt = 2 * Kt(Z * T) * Li(f(rt) / 2));
          var nt = S - y,
            Nt = T - Z,
            ce = 1 + (0.015 * pt(U - 50, 2)) / Kt(20 + pt(U - 50, 2)),
            ue = 1 + 0.045 * I,
            Ye = 1 + 0.015 * I * et,
            Ze = 30 * uc(-pt((J - 275) / 25, 2)),
            te = 2 * Kt(pt(I, 7) / (pt(I, 7) + pt(25, 7))),
            Te = -te * Li(2 * f(Ze)),
            gr = Kt(
              pt(nt / (l * ce), 2) +
                pt(Nt / (c * ue), 2) +
                pt(rt / (d * Ye), 2) +
                Te * (Nt / (c * ue)) * (rt / (d * Ye))
            );
          return cc(0, hc(100, gr));
        },
        $i = j,
        dc = function (s, o, l) {
          l === void 0 && (l = "lab"), (s = new $i(s)), (o = new $i(o));
          var c = s.get(l),
            d = o.get(l),
            p = 0;
          for (var f in c) {
            var m = (c[f] || 0) - (d[f] || 0);
            p += m * m;
          }
          return Math.sqrt(p);
        },
        pc = j,
        gc = function () {
          for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
          try {
            return (
              new (Function.prototype.bind.apply(pc, [null].concat(s)))(), !0
            );
          } catch {
            return !1;
          }
        },
        Ai = lt,
        zi = On,
        vc = {
          cool: function () {
            return zi([Ai.hsl(180, 1, 0.9), Ai.hsl(250, 0.7, 0.4)]);
          },
          hot: function () {
            return zi(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
          },
        },
        Vr = {
          OrRd: [
            "#fff7ec",
            "#fee8c8",
            "#fdd49e",
            "#fdbb84",
            "#fc8d59",
            "#ef6548",
            "#d7301f",
            "#b30000",
            "#7f0000",
          ],
          PuBu: [
            "#fff7fb",
            "#ece7f2",
            "#d0d1e6",
            "#a6bddb",
            "#74a9cf",
            "#3690c0",
            "#0570b0",
            "#045a8d",
            "#023858",
          ],
          BuPu: [
            "#f7fcfd",
            "#e0ecf4",
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8c6bb1",
            "#88419d",
            "#810f7c",
            "#4d004b",
          ],
          Oranges: [
            "#fff5eb",
            "#fee6ce",
            "#fdd0a2",
            "#fdae6b",
            "#fd8d3c",
            "#f16913",
            "#d94801",
            "#a63603",
            "#7f2704",
          ],
          BuGn: [
            "#f7fcfd",
            "#e5f5f9",
            "#ccece6",
            "#99d8c9",
            "#66c2a4",
            "#41ae76",
            "#238b45",
            "#006d2c",
            "#00441b",
          ],
          YlOrBr: [
            "#ffffe5",
            "#fff7bc",
            "#fee391",
            "#fec44f",
            "#fe9929",
            "#ec7014",
            "#cc4c02",
            "#993404",
            "#662506",
          ],
          YlGn: [
            "#ffffe5",
            "#f7fcb9",
            "#d9f0a3",
            "#addd8e",
            "#78c679",
            "#41ab5d",
            "#238443",
            "#006837",
            "#004529",
          ],
          Reds: [
            "#fff5f0",
            "#fee0d2",
            "#fcbba1",
            "#fc9272",
            "#fb6a4a",
            "#ef3b2c",
            "#cb181d",
            "#a50f15",
            "#67000d",
          ],
          RdPu: [
            "#fff7f3",
            "#fde0dd",
            "#fcc5c0",
            "#fa9fb5",
            "#f768a1",
            "#dd3497",
            "#ae017e",
            "#7a0177",
            "#49006a",
          ],
          Greens: [
            "#f7fcf5",
            "#e5f5e0",
            "#c7e9c0",
            "#a1d99b",
            "#74c476",
            "#41ab5d",
            "#238b45",
            "#006d2c",
            "#00441b",
          ],
          YlGnBu: [
            "#ffffd9",
            "#edf8b1",
            "#c7e9b4",
            "#7fcdbb",
            "#41b6c4",
            "#1d91c0",
            "#225ea8",
            "#253494",
            "#081d58",
          ],
          Purples: [
            "#fcfbfd",
            "#efedf5",
            "#dadaeb",
            "#bcbddc",
            "#9e9ac8",
            "#807dba",
            "#6a51a3",
            "#54278f",
            "#3f007d",
          ],
          GnBu: [
            "#f7fcf0",
            "#e0f3db",
            "#ccebc5",
            "#a8ddb5",
            "#7bccc4",
            "#4eb3d3",
            "#2b8cbe",
            "#0868ac",
            "#084081",
          ],
          Greys: [
            "#ffffff",
            "#f0f0f0",
            "#d9d9d9",
            "#bdbdbd",
            "#969696",
            "#737373",
            "#525252",
            "#252525",
            "#000000",
          ],
          YlOrRd: [
            "#ffffcc",
            "#ffeda0",
            "#fed976",
            "#feb24c",
            "#fd8d3c",
            "#fc4e2a",
            "#e31a1c",
            "#bd0026",
            "#800026",
          ],
          PuRd: [
            "#f7f4f9",
            "#e7e1ef",
            "#d4b9da",
            "#c994c7",
            "#df65b0",
            "#e7298a",
            "#ce1256",
            "#980043",
            "#67001f",
          ],
          Blues: [
            "#f7fbff",
            "#deebf7",
            "#c6dbef",
            "#9ecae1",
            "#6baed6",
            "#4292c6",
            "#2171b5",
            "#08519c",
            "#08306b",
          ],
          PuBuGn: [
            "#fff7fb",
            "#ece2f0",
            "#d0d1e6",
            "#a6bddb",
            "#67a9cf",
            "#3690c0",
            "#02818a",
            "#016c59",
            "#014636",
          ],
          Viridis: [
            "#440154",
            "#482777",
            "#3f4a8a",
            "#31678e",
            "#26838f",
            "#1f9d8a",
            "#6cce5a",
            "#b6de2b",
            "#fee825",
          ],
          Spectral: [
            "#9e0142",
            "#d53e4f",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#e6f598",
            "#abdda4",
            "#66c2a5",
            "#3288bd",
            "#5e4fa2",
          ],
          RdYlGn: [
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#d9ef8b",
            "#a6d96a",
            "#66bd63",
            "#1a9850",
            "#006837",
          ],
          RdBu: [
            "#67001f",
            "#b2182b",
            "#d6604d",
            "#f4a582",
            "#fddbc7",
            "#f7f7f7",
            "#d1e5f0",
            "#92c5de",
            "#4393c3",
            "#2166ac",
            "#053061",
          ],
          PiYG: [
            "#8e0152",
            "#c51b7d",
            "#de77ae",
            "#f1b6da",
            "#fde0ef",
            "#f7f7f7",
            "#e6f5d0",
            "#b8e186",
            "#7fbc41",
            "#4d9221",
            "#276419",
          ],
          PRGn: [
            "#40004b",
            "#762a83",
            "#9970ab",
            "#c2a5cf",
            "#e7d4e8",
            "#f7f7f7",
            "#d9f0d3",
            "#a6dba0",
            "#5aae61",
            "#1b7837",
            "#00441b",
          ],
          RdYlBu: [
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee090",
            "#ffffbf",
            "#e0f3f8",
            "#abd9e9",
            "#74add1",
            "#4575b4",
            "#313695",
          ],
          BrBG: [
            "#543005",
            "#8c510a",
            "#bf812d",
            "#dfc27d",
            "#f6e8c3",
            "#f5f5f5",
            "#c7eae5",
            "#80cdc1",
            "#35978f",
            "#01665e",
            "#003c30",
          ],
          RdGy: [
            "#67001f",
            "#b2182b",
            "#d6604d",
            "#f4a582",
            "#fddbc7",
            "#ffffff",
            "#e0e0e0",
            "#bababa",
            "#878787",
            "#4d4d4d",
            "#1a1a1a",
          ],
          PuOr: [
            "#7f3b08",
            "#b35806",
            "#e08214",
            "#fdb863",
            "#fee0b6",
            "#f7f7f7",
            "#d8daeb",
            "#b2abd2",
            "#8073ac",
            "#542788",
            "#2d004b",
          ],
          Set2: [
            "#66c2a5",
            "#fc8d62",
            "#8da0cb",
            "#e78ac3",
            "#a6d854",
            "#ffd92f",
            "#e5c494",
            "#b3b3b3",
          ],
          Accent: [
            "#7fc97f",
            "#beaed4",
            "#fdc086",
            "#ffff99",
            "#386cb0",
            "#f0027f",
            "#bf5b17",
            "#666666",
          ],
          Set1: [
            "#e41a1c",
            "#377eb8",
            "#4daf4a",
            "#984ea3",
            "#ff7f00",
            "#ffff33",
            "#a65628",
            "#f781bf",
            "#999999",
          ],
          Set3: [
            "#8dd3c7",
            "#ffffb3",
            "#bebada",
            "#fb8072",
            "#80b1d3",
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd",
            "#ccebc5",
            "#ffed6f",
          ],
          Dark2: [
            "#1b9e77",
            "#d95f02",
            "#7570b3",
            "#e7298a",
            "#66a61e",
            "#e6ab02",
            "#a6761d",
            "#666666",
          ],
          Paired: [
            "#a6cee3",
            "#1f78b4",
            "#b2df8a",
            "#33a02c",
            "#fb9a99",
            "#e31a1c",
            "#fdbf6f",
            "#ff7f00",
            "#cab2d6",
            "#6a3d9a",
            "#ffff99",
            "#b15928",
          ],
          Pastel2: [
            "#b3e2cd",
            "#fdcdac",
            "#cbd5e8",
            "#f4cae4",
            "#e6f5c9",
            "#fff2ae",
            "#f1e2cc",
            "#cccccc",
          ],
          Pastel1: [
            "#fbb4ae",
            "#b3cde3",
            "#ccebc5",
            "#decbe4",
            "#fed9a6",
            "#ffffcc",
            "#e5d8bd",
            "#fddaec",
            "#f2f2f2",
          ],
        },
        jn = 0,
        Oi = Object.keys(Vr);
      jn < Oi.length;
      jn += 1
    ) {
      var Fi = Oi[jn];
      Vr[Fi.toLowerCase()] = Vr[Fi];
    }
    var mc = Vr,
      bt = lt;
    (bt.average = Ah),
      (bt.bezier = _h),
      (bt.blend = Hh),
      (bt.cubehelix = Kh),
      (bt.mix = bt.interpolate = ci),
      (bt.random = sc),
      (bt.scale = On),
      (bt.analyze = Si.analyze),
      (bt.contrast = lc),
      (bt.deltaE = fc),
      (bt.distance = dc),
      (bt.limits = Si.limits),
      (bt.valid = gc),
      (bt.scales = vc),
      (bt.colors = Xs),
      (bt.brewer = mc);
    var yc = bt;
    return yc;
  });
})(ia);
var ht = ia.exports;
const ve = (() => (
  (ht.Color.symbol = ht.Color.prototype.symbol =
    Symbol.for("@motion-canvas/core/types/Color")),
  (ht.Color.lerp = ht.Color.prototype.lerp =
    (n, t, e, r = "lch") => {
      typeof n == "string" && (n = new ht.Color(n)),
        typeof t == "string" && (t = new ht.Color(t));
      const i = n instanceof ht.Color,
        a = t instanceof ht.Color;
      return (
        i || (n = a ? t.alpha(0) : new ht.Color("rgba(0, 0, 0, 0)")),
        a || (t = i ? n.alpha(0) : new ht.Color("rgba(0, 0, 0, 0)")),
        ht.mix(n, t, e, r)
      );
    }),
  (ht.Color.createLerp = ht.Color.prototype.createLerp =
    (n) => (t, e, r) =>
      ht.Color.lerp(t, e, r, n)),
  (ht.Color.createSignal = (n, t = ht.Color.lerp) =>
    new Ae(n, t, void 0, (e) => new ht.Color(e)).toSignal()),
  (ht.Color.prototype.toSymbol = () => ht.Color.symbol),
  (ht.Color.prototype.toUniform = function (n, t) {
    n.uniform4fv(t, this.gl());
  }),
  (ht.Color.prototype.serialize = function () {
    return this.css();
  }),
  (ht.Color.prototype.lerp = function (n, t, e) {
    return ht.Color.lerp(this, n, t, e);
  }),
  ht.Color
))();
function lu(n, t) {
  return v.fromDegrees(n).transform(t).degrees;
}
function qn(n, t) {
  return v.magnitude(t.m11, t.m12) * n;
}
class Gn extends Ot {
  constructor() {
    super(...arguments), (this.type = ve.symbol);
  }
  parse(t) {
    return t === null ? null : new ve(t);
  }
  serialize() {
    var t;
    return ((t = this.value.current) == null ? void 0 : t.serialize()) ?? null;
  }
}
class $e extends Ot {
  constructor(t, e, r = ((i) => ((i = e[0]) == null ? void 0 : i.value))()) {
    super(t, r), (this.options = e), (this.type = $e.symbol);
  }
  set(t) {
    var e;
    super.set((e = this.getOption(t)) == null ? void 0 : e.value);
  }
  parse(t) {
    var e;
    return (e = this.getOption(t)) == null ? void 0 : e.value;
  }
  getOption(t) {
    return this.options.find((e) => e.value === t) ?? this.options[0];
  }
}
$e.symbol = Symbol.for("@motion-canvas/core/meta/EnumMetaField");
class hu extends Ot {
  get onFieldsChanged() {
    return this.fields.subscribable;
  }
  get options() {
    return this.optionFields[this.current];
  }
  constructor(t, e, r = 0) {
    var u, g;
    const i = e.plugins.flatMap((b) => {
        var x;
        return ((x = b.exporters) == null ? void 0 : x.call(b, e)) ?? [];
      }),
      a = i.map((b) => b.meta(e)),
      h = new $e(
        "exporter",
        i.map((b) => ({ value: b.id, text: b.displayName })),
        (u = i[r]) == null ? void 0 : u.id
      );
    super(t, { name: h.get(), options: (g = a[r]) == null ? void 0 : g.get() }),
      (this.current = r),
      (this.type = Object),
      (this.handleChange = () => {
        var O, N, Y;
        const b = this.exporterField.get(),
          x = Math.max(
            this.exporters.findIndex((st) => st.id === b),
            0
          );
        this.current !== x &&
          ((O = this.options) == null ||
            O.onChanged.unsubscribe(this.handleChange),
          (this.current = x),
          (N = this.options) == null ||
            N.onChanged.subscribe(this.handleChange, !1),
          (this.fields.current = this.options
            ? [this.exporterField, this.options]
            : [this.exporterField])),
          (this.value.current = {
            name: this.exporterField.get(),
            options: ((Y = this.options) == null ? void 0 : Y.get()) ?? null,
          });
      }),
      (this.exporters = i),
      (this.exporterField = h),
      this.exporterField.onChanged.subscribe(this.handleChange, !1),
      this.exporterField.disable(a.length < 2).space(),
      (this.optionFields = a),
      (this.fields = new ge([this.exporterField])),
      this.options &&
        (this.options.onChanged.subscribe(this.handleChange, !1),
        (this.fields.current = [this.exporterField, this.options]));
  }
  set(t) {
    var e;
    this.exporterField.set(t.name),
      (e = this.options) == null || e.set(t.options ?? {});
  }
  serialize() {
    var t;
    return {
      name: this.exporterField.serialize(),
      options: ((t = this.options) == null ? void 0 : t.serialize()) ?? null,
    };
  }
  clone() {
    return new this.constructor(this.name, this.exporters, this.current);
  }
}
var vr;
class Sr {
  constructor(t, e = !1) {
    (this.name = t),
      (this.source = e),
      (this.lock = new kc()),
      (this.ignoreChange = !1),
      (this.cache = null),
      (this.metaField = null),
      (this.handleChanged = async () => {});
  }
  attach(t) {
    var e;
    this.metaField ||
      ((this.metaField = t),
      this.cache && this.metaField.set(this.cache),
      (e = this.metaField) == null ||
        e.onChanged.subscribe(this.handleChanged));
  }
  async saveData(t) {
    if (this.source === !1) return;
    if (!this.source)
      throw new Error(`The meta file for ${this.name} is missing.`);
    if (vr.sourceLookup[this.source])
      throw new Error(`Metadata for ${this.name} is already being updated`);
    const e = this.source;
    await new Promise((r, i) => {
      setTimeout(() => {
        delete vr.sourceLookup[e],
          i(`Connection timeout when updating metadata for ${this.name}`);
      }, 1e3),
        (vr.sourceLookup[e] = () => {
          delete vr.sourceLookup[e], r();
        }),
        (void 0).send("motion-canvas:meta", { source: e, data: t });
    });
  }
  loadData(t) {
    var e;
    (this.ignoreChange = !0),
      (this.cache = t),
      (e = this.metaField) == null || e.set(t),
      (this.ignoreChange = !1);
  }
}
vr = Sr;
Sr.sourceLookup = {};
class Wn extends Ot {
  constructor() {
    super(...arguments), (this.type = Number), (this.presets = []);
  }
  parse(t) {
    let e = parseFloat(t);
    return (
      this.min !== void 0 && e < this.min && (e = this.min),
      this.max !== void 0 && e > this.max && (e = this.max),
      e
    );
  }
  getPresets() {
    return this.presets;
  }
  setPresets(t) {
    return (this.presets = t), this;
  }
  setRange(t, e) {
    return (this.min = t), (this.max = e), this;
  }
  getMin() {
    return this.min ?? -1 / 0;
  }
  getMax() {
    return this.max ?? 1 / 0;
  }
}
class cn extends Ot {
  constructor() {
    super(...arguments), (this.type = cn.symbol);
  }
  parse(t) {
    return this.parseRange(1 / 0, t[0], t[1] ?? 1 / 0);
  }
  update(t, e, r, i) {
    this.value.current = this.parseRange(r / i - mr, t / i - mr, e / i - mr);
  }
  parseRange(t, e = this.value.current[0], r = this.value.current[1]) {
    return (
      (e = Lt(0, t, e)),
      (r = Lt(0, t, r ?? 1 / 0)),
      e > r && ([e, r] = [r, e]),
      r >= t && (r = 1 / 0),
      [e, r]
    );
  }
}
cn.symbol = Symbol.for("@motion-canvas/core/meta/RangeMetaField");
class aa extends Ot {
  constructor() {
    super(...arguments), (this.type = v.symbol);
  }
  parse(t) {
    return new v(t);
  }
  serialize() {
    return this.value.current.serialize();
  }
}
var oa;
class Tr {
  static meta(t) {
    return new ne(this.displayName, {
      fastStart: new nn("fast start", !0),
      includeAudio: new nn("include audio", !0).disable(!t.audio),
    });
  }
  static async create(t, e) {
    return new oa(t, e);
  }
  constructor(t, e) {
    (this.project = t), (this.settings = e);
  }
  async start() {
    const t = this.settings.exporter.options;
    await this.invoke("start", {
      ...this.settings,
      ...t,
      audio: this.project.audio,
      audioOffset:
        this.project.meta.shared.audioOffset.get() - this.settings.range[0],
    });
  }
  async handleFrame(t) {
    await this.invoke("handleFrame", { data: t.toDataURL("image/png") });
  }
  async stop(t) {
    await this.invoke("end", t);
  }
  invoke(t, e) {
    throw new Error("FFmpegExporter can only be used locally.");
  }
}
oa = Tr;
Tr.id = "@motion-canvas/ffmpeg";
Tr.displayName = "Video (FFmpeg)";
Tr.response = new qt();
const cu = $c({
  name: "ffmpeg-plugin",
  exporters() {
    return [Tr];
  },
});
let Qn;
Qn ?? (Qn = new Sr("project", !1));
Qn.loadData({
  version: 0,
  shared: {
    background: "rgb(35,35,35)",
    range: [0, null],
    size: { x: 607, y: 1080 },
    audioOffset: 0,
  },
  preview: { fps: 30, resolutionScale: 1 },
  rendering: {
    fps: 60,
    resolutionScale: 1,
    colorSpace: "srgb",
    exporter: {
      name: "@motion-canvas/core/image-sequence",
      options: { fileType: "image/png", quality: 100, groupByScene: !1 },
    },
  },
});
const uu = Qn;
let Kn;
Kn ?? (Kn = new Sr("index", !1));
Kn.loadData({ version: 0, timeEvents: [], seed: 2657325461 });
const fu = Kn;
function du(n) {
  var t;
  return !!((t = n.prototype) != null && t.isClass);
}
const pu = Symbol.for("@motion-canvas/2d/fragment");
function F(n, t, e) {
  const { ref: r, children: i, ...a } = t,
    h = Array.isArray(i) ? i.flat() : i;
  if (n === pu) return h;
  if (du(n)) {
    const u = new n({ ...a, children: h, key: e });
    return r == null || r(u), u;
  } else return n({ ...a, ref: r, children: h, key: e });
}
const qi = {
  invert: { name: "invert" },
  sepia: { name: "sepia" },
  grayscale: { name: "grayscale" },
  brightness: { name: "brightness", default: 1 },
  contrast: { name: "contrast", default: 1 },
  saturate: { name: "saturate", default: 1 },
  hue: { name: "hue-rotate", unit: "deg", scale: 1 },
  blur: { name: "blur", transform: !0, unit: "px", scale: 1 },
};
class gu {
  get name() {
    return this.props.name;
  }
  get default() {
    return this.props.default;
  }
  constructor(t) {
    (this.props = {
      name: "invert",
      default: 0,
      unit: "%",
      scale: 100,
      transform: !1,
      ...t,
      value: t.value ?? t.default ?? 0,
    }),
      (this.value = ze(this.props.value, ot, this));
  }
  isActive() {
    return this.value() !== this.props.default;
  }
  serialize(t) {
    let e = this.value();
    return (
      this.props.transform && (e = qn(e, t)),
      `${this.props.name}(${e * this.props.scale}${this.props.unit})`
    );
  }
}
const ee = Symbol.for("@motion-canvas/2d/decorators/initializers");
function Cr(n, t) {
  if (!n[ee]) n[ee] = [];
  else if (n[ee] && !Object.prototype.hasOwnProperty.call(n, ee)) {
    const e = Object.getPrototypeOf(n);
    n[ee] = [...e[ee]];
  }
  n[ee].push(t);
}
function vu(n, t) {
  if (n[ee])
    try {
      n[ee].forEach((e) => e(n, t));
    } catch (e) {
      throw (e.inspect ?? (e.inspect = n.key), e);
    }
}
function D() {
  return (n, t) => {
    Cr(n, (e) => {
      const r = Object.getPrototypeOf(e)[t];
      e[t] = iu(r.bind(e), e);
    });
  };
}
function Xn(n = {}, t, e) {
  const r = {};
  if (e && t) {
    const i = n.setter ?? (t == null ? void 0 : t[`set${Le(e)}`]);
    i && (r.setter = i.bind(t));
    const a = n.getter ?? (t == null ? void 0 : t[`get${Le(e)}`]);
    a && (r.getter = a.bind(t));
    const h = n.tweener ?? (t == null ? void 0 : t[`tween${Le(e)}`]);
    h && (r.tweener = h.bind(t));
  }
  return r;
}
const re = Symbol.for("@motion-canvas/2d/decorators/properties");
function Oe(n, t) {
  var e;
  return ((e = n[re]) == null ? void 0 : e[t]) ?? null;
}
function ts(n, t) {
  let e;
  return (
    n[re]
      ? n[re] && !Object.prototype.hasOwnProperty.call(n, re)
        ? (n[re] = e =
            Object.fromEntries(
              Object.entries(n[re]).map(([r, i]) => [r, { ...i }])
            ))
        : (e = n[re])
      : (n[re] = e = {}),
    e[t] ?? (e[t] = { cloneable: !0, inspectable: !0, compoundEntries: [] }),
    e[t]
  );
}
function la(n) {
  return n && typeof n == "object" ? n[re] ?? {} : {};
}
function es(n, t) {
  vu(n);
  for (const [e, r] of Object.entries(la(n))) {
    const i = n[e];
    if ((i.reset(), t[e] !== void 0 && i(t[e]), r.compoundEntries !== void 0))
      for (const [a, h] of r.compoundEntries) h in t && i[a](t[h]);
  }
}
function P() {
  return (n, t) => {
    const e = ts(n, t);
    Cr(n, (r) => {
      var u;
      let i = e.default;
      const a = r[`getDefault${Le(t)}`];
      a && (i = () => a.call(r, e.default));
      const h = new Ae(
        i,
        e.interpolationFunction ?? Ke,
        r,
        (u = e.parser) == null ? void 0 : u.bind(r),
        Xn(e, r, t)
      );
      r[t] = h.toSignal();
    });
  };
}
function A(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.default = n;
  };
}
function rs(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.interpolationFunction = n;
  };
}
function ns(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = n;
  };
}
function Pr(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    (r.parser = (i) => new n(i)),
      "lerp" in n &&
        (r.interpolationFunction ?? (r.interpolationFunction = n.lerp));
  };
}
function Fe(n = !0) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.cloneable = n;
  };
}
function ha(n = !0) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      Tt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.inspectable = n;
  };
}
function ca(n, t = hn) {
  return (e, r) => {
    const i = ts(e, r);
    (i.compound = !0),
      (i.compoundEntries = Object.entries(n)),
      Cr(e, (a) => {
        if (!i.parser) {
          Tt().error(`Missing parser decorator for "${r.toString()}"`);
          return;
        }
        const h = i.default,
          u = i.parser.bind(a),
          g = new t(
            i.compoundEntries.map(([b, x]) => {
              const O = new Ae(
                Me(h, (N) => u(N)[b]),
                ot,
                a,
                void 0,
                Xn(void 0, a, x)
              ).toSignal();
              return [b, O];
            }),
            u,
            h,
            i.interpolationFunction ?? Ke,
            a,
            Xn(i, a, r)
          );
        a[r] = g.toSignal();
      });
  };
}
function ie(n) {
  return (t, e) => {
    ca(
      typeof n == "object" ? n : { x: n ? `${n}X` : "x", y: n ? `${n}Y` : "y" },
      sa
    )(t, e),
      Pr(v)(t, e);
  };
}
var be =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
class Qt {
  constructor(t) {
    es(this, t);
  }
  canvasGradient(t) {
    let e;
    switch (this.type()) {
      case "linear":
        e = t.createLinearGradient(
          this.from.x(),
          this.from.y(),
          this.to.x(),
          this.to.y()
        );
        break;
      case "conic":
        e = t.createConicGradient(this.angle(), this.from.x(), this.from.y());
        break;
      case "radial":
        e = t.createRadialGradient(
          this.from.x(),
          this.from.y(),
          this.fromRadius(),
          this.to.x(),
          this.to.y(),
          this.toRadius()
        );
        break;
    }
    for (const { offset: r, color: i } of this.stops())
      e.addColorStop(Jt(r), new ve(Jt(i)).serialize());
    return e;
  }
}
be([A("linear"), P()], Qt.prototype, "type", void 0);
be([ie("from")], Qt.prototype, "from", void 0);
be([ie("to")], Qt.prototype, "to", void 0);
be([A(0), P()], Qt.prototype, "angle", void 0);
be([A(0), P()], Qt.prototype, "fromRadius", void 0);
be([A(0), P()], Qt.prototype, "toRadius", void 0);
be([A([]), P()], Qt.prototype, "stops", void 0);
be([D()], Qt.prototype, "canvasGradient", null);
var ss =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
class Rr {
  constructor(t) {
    es(this, t);
  }
  canvasPattern(t) {
    return t.createPattern(this.image(), this.repetition());
  }
}
ss([P()], Rr.prototype, "image", void 0);
ss([A(null), P()], Rr.prototype, "repetition", void 0);
ss([D()], Rr.prototype, "canvasPattern", null);
function mu(n) {
  return n === null ? null : n instanceof Qt || n instanceof Rr ? n : new ve(n);
}
function Hn(n, t) {
  return n === null
    ? ""
    : n instanceof ve
    ? n.serialize()
    : n instanceof Qt
    ? n.canvasGradient(t)
    : n instanceof Rr
    ? n.canvasPattern(t) ?? ""
    : "";
}
function Gi(n, t, e, r, i) {
  if (e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0) {
    yu(n, t);
    return;
  }
  const a = pe(e.top, e.right, e.left, t),
    h = pe(e.right, e.top, e.bottom, t),
    u = pe(e.bottom, e.left, e.right, t),
    g = pe(e.left, e.bottom, e.top, t);
  if (r) {
    const b = (x) => {
      const O = x * i;
      return x - O;
    };
    n.moveTo(t.left + a, t.top),
      n.lineTo(t.right - h, t.top),
      n.bezierCurveTo(
        t.right - b(h),
        t.top,
        t.right,
        t.top + b(h),
        t.right,
        t.top + h
      ),
      n.lineTo(t.right, t.bottom - u),
      n.bezierCurveTo(
        t.right,
        t.bottom - b(u),
        t.right - b(u),
        t.bottom,
        t.right - u,
        t.bottom
      ),
      n.lineTo(t.left + g, t.bottom),
      n.bezierCurveTo(
        t.left + b(g),
        t.bottom,
        t.left,
        t.bottom - b(g),
        t.left,
        t.bottom - g
      ),
      n.lineTo(t.left, t.top + a),
      n.bezierCurveTo(
        t.left,
        t.top + b(a),
        t.left + b(a),
        t.top,
        t.left + a,
        t.top
      );
    return;
  }
  n.moveTo(t.left + a, t.top),
    n.arcTo(t.right, t.top, t.right, t.bottom, h),
    n.arcTo(t.right, t.bottom, t.left, t.bottom, u),
    n.arcTo(t.left, t.bottom, t.left, t.top, g),
    n.arcTo(t.left, t.top, t.right, t.top, a);
}
function pe(n, t, e, r) {
  const i = n + t > r.width ? r.width * (n / (n + t)) : n,
    a = n + e > r.height ? r.height * (n / (n + e)) : n;
  return Math.min(i, a);
}
function yu(n, t) {
  n.rect(t.x, t.y, t.width, t.height);
}
function Lr(n, t) {
  n.moveTo(t.x, t.y);
}
function Vt(n, t) {
  n.lineTo(t.x, t.y);
}
function fe(n, t) {
  if (!(t.length < 2)) {
    Lr(n, t[0]);
    for (const e of t.slice(1)) Vt(n, e);
  }
}
function ua(n, t, e = 8) {
  Vt(n, t.addY(-e)), Vt(n, t.addY(e)), Vt(n, t), Vt(n, t.addX(-e)), fa(n, t, e);
}
function fa(n, t, e, r = 0, i = Math.PI * 2, a = !1) {
  n.arc(t.x, t.y, e, r, i, a);
}
function bu(n, t, e, r) {
  n.bezierCurveTo(t.x, t.y, e.x, e.y, r.x, r.y);
}
function is(n) {
  return (t) => t instanceof n;
}
function da() {
  return (n, t) => {
    P()(n, t), ns(mu)(n, t), rs(ve.lerp)(n, t), A(null)(n, t);
  };
}
function wu() {
  return (n, t) => {
    P()(n, t), Pr(ve)(n, t);
  };
}
function we(n, t = (e) => e) {
  return (e, r) => {
    e[`getDefault${Le(r)}`] = function () {
      this.requestLayoutUpdate();
      const i = this.element.style[n];
      this.element.style[n] = "";
      const a = t.call(this, this.styles.getPropertyValue(n));
      return (this.element.style[n] = i), a;
    };
  };
}
class xu extends Ae {
  constructor(t, e) {
    super(t, Ke, e);
    for (const r in qi) {
      const i = qi[r];
      Object.defineProperty(this.invokable, r, {
        value: (a, h, u = Yt) => {
          var b, x, O;
          if (a === void 0)
            return (
              ((x =
                (b = this.get()) == null
                  ? void 0
                  : b.find((N) => N.name === i.name)) == null
                ? void 0
                : x.value()) ??
              i.default ??
              0
            );
          let g =
            (O = this.get()) == null
              ? void 0
              : O.find((N) => N.name === i.name);
          return (
            g || ((g = new gu(i)), this.set([...this.get(), g])),
            h === void 0 ? (g.value(a), this.owner) : g.value(a, h, u)
          );
        },
      });
    }
  }
  *tweener(t, e, r) {
    const i = this.get(),
      a = Jt(t);
    if (Su(i, a)) {
      yield* B(...i.map((g, b) => g.value(a[b].value(), e, r))), this.set(a);
      return;
    }
    for (const g of a) g.value(g.default);
    const h = a.map((g) => g.value.context.raw()),
      u = i.length > 0 && a.length > 0 ? e / 2 : e;
    i.length > 0 && (yield* B(...i.map((g) => g.value(g.default, u, r)))),
      this.set(a),
      a.length > 0 && (yield* B(...a.map((g, b) => g.value(h[b], u, r))));
  }
}
function ku() {
  return (n, t) => {
    const e = ts(n, t);
    Cr(n, (r) => {
      r[t] = new xu(e.default ?? [], r).toSignal();
    });
  };
}
function Su(n, t) {
  if (n.length !== t.length) return !1;
  for (let e = 0; e < n.length; e++) if (n[e].name !== t[e].name) return !1;
  return !0;
}
const Tu = Symbol.for("@motion-canvas/2d/nodeName");
function ae(n) {
  return function (t) {
    t.prototype[Tu] = n;
  };
}
function Xi(n, t) {
  const e = Lt(0, n.arcLength, t);
  let r = 0;
  for (const i of n.segments) {
    const a = r;
    if (((r += i.arcLength), r >= e)) {
      const h = (e - a) / i.arcLength;
      return i.getPoint(Lt(0, 1, h));
    }
  }
  return { position: v.zero, tangent: v.up, normal: v.up };
}
function un(n) {
  return (t, e) => {
    ca({
      top: n ? `${n}Top` : "top",
      right: n ? `${n}Right` : "right",
      bottom: n ? `${n}Bottom` : "bottom",
      left: n ? `${n}Left` : "left",
    })(t, e),
      Pr(Bt)(t, e);
  };
}
function Cu(n) {
  let t;
  return (
    n
      ? typeof n == "string"
        ? (t = [{ fragment: n }])
        : Array.isArray(n)
        ? (t = n.map((e) => (typeof e == "string" ? { fragment: e } : e)))
        : (t = [n])
      : (t = []),
    !on().experimentalFeatures &&
      t.length > 0 &&
      ((t = []),
      Tt().log({
        ...zc("Node uses experimental shaders."),
        inspect: this.key,
      })),
    t
  );
}
function Qr() {
  return on();
}
var W =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  Kr;
let _ = (Kr = class {
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  getAbsolutePosition() {
    return new v(this.parentToWorld().transformPoint(this.position()));
  }
  setAbsolutePosition(t) {
    this.position(
      Me(t, (e) => new v(e).transformAsPoint(this.worldToParent()))
    );
  }
  getAbsoluteRotation() {
    const t = this.localToWorld();
    return v.degrees(t.m11, t.m12);
  }
  setAbsoluteRotation(t) {
    this.rotation(Me(t, (e) => lu(e, this.worldToParent())));
  }
  getAbsoluteScale() {
    const t = this.localToWorld();
    return new v(v.magnitude(t.m11, t.m12), v.magnitude(t.m21, t.m22));
  }
  setAbsoluteScale(t) {
    this.scale(Me(t, (e) => this.getRelativeScale(new v(e))));
  }
  getRelativeScale(t) {
    var r;
    const e =
      ((r = this.parent()) == null ? void 0 : r.absoluteScale()) ?? v.one;
    return t.div(e);
  }
  *tweenCompositeOperation(t, e, r) {
    const i = Jt(t);
    i === "source-over"
      ? (yield* this.compositeOverride(1, e, r),
        this.compositeOverride(0),
        this.compositeOperation(i))
      : (this.compositeOperation(i),
        this.compositeOverride(1),
        yield* this.compositeOverride(0, e, r));
  }
  absoluteOpacity() {
    var t;
    return (
      (((t = this.parent()) == null ? void 0 : t.absoluteOpacity()) ?? 1) *
      this.opacity()
    );
  }
  hasFilters() {
    return !!this.filters().find((t) => t.isActive());
  }
  hasShadow() {
    return (
      !!this.shadowColor() &&
      (this.shadowBlur() > 0 ||
        this.shadowOffset.x() !== 0 ||
        this.shadowOffset.y() !== 0)
    );
  }
  filterString() {
    let t = "";
    const e = this.compositeToWorld();
    for (const r of this.filters()) r.isActive() && (t += " " + r.serialize(e));
    return t;
  }
  getSpawner() {
    return this.children();
  }
  setSpawner(t) {
    this.children(t);
  }
  setChildren(t) {
    if (this.children.context.raw() !== t) {
      if ((this.children.context.setter(t), !se(t))) this.spawnChildren(!1, t);
      else if (!this.hasSpawnedChildren)
        for (const e of this.realChildren) e.parent(null);
    }
  }
  getChildren() {
    return this.children.context.getter(), this.spawnedChildren();
  }
  spawnedChildren() {
    const t = this.children.context.getter();
    return (
      se(this.children.context.raw()) && this.spawnChildren(!0, t),
      this.realChildren
    );
  }
  sortedChildren() {
    return [...this.children()].sort((t, e) =>
      Math.sign(t.zIndex() - e.zIndex())
    );
  }
  constructor({ children: t, spawner: e, key: r, ...i }) {
    (this.compositeOverride = ze(0)),
      (this.stateStack = []),
      (this.realChildren = []),
      (this.hasSpawnedChildren = !1),
      (this.parent = ze(null)),
      (this.properties = la(this));
    const a = Qr();
    ([this.key, this.unregister] = a.registerNode(this, r)),
      (this.view2D = a.getView()),
      (this.creationStack = new Error().stack),
      es(this, i),
      e &&
        Tt().warn({
          message: "Node.spawner() has been deprecated.",
          remarks: "Use <code>Node.children()</code> instead.",
          inspect: this.key,
          stack: new Error().stack,
        }),
      this.children(e ?? t);
  }
  localToWorld() {
    const t = this.parent();
    return t
      ? t.localToWorld().multiply(this.localToParent())
      : this.localToParent();
  }
  worldToLocal() {
    return this.localToWorld().inverse();
  }
  worldToParent() {
    var t;
    return (
      ((t = this.parent()) == null ? void 0 : t.worldToLocal()) ??
      new DOMMatrix()
    );
  }
  parentToWorld() {
    var t;
    return (
      ((t = this.parent()) == null ? void 0 : t.localToWorld()) ??
      new DOMMatrix()
    );
  }
  localToParent() {
    const t = new DOMMatrix();
    return (
      t.translateSelf(this.x(), this.y()),
      t.rotateSelf(0, 0, this.rotation()),
      t.scaleSelf(this.scale.x(), this.scale.y()),
      t.skewXSelf(this.skew.x()),
      t.skewYSelf(this.skew.y()),
      t
    );
  }
  compositeToWorld() {
    var t;
    return (
      ((t = this.compositeRoot()) == null ? void 0 : t.localToWorld()) ??
      new DOMMatrix()
    );
  }
  compositeRoot() {
    var t;
    return this.composite()
      ? this
      : ((t = this.parent()) == null ? void 0 : t.compositeRoot()) ?? null;
  }
  compositeToLocal() {
    const t = this.compositeRoot();
    if (t) {
      const e = this.worldToLocal();
      return (e.m44 = 1), t.localToWorld().multiply(e);
    }
    return new DOMMatrix();
  }
  view() {
    return this.view2D;
  }
  add(t) {
    return this.insert(t, 1 / 0);
  }
  insert(t, e = 0) {
    const r = Array.isArray(t) ? t : [t];
    if (r.length === 0) return this;
    const i = this.children(),
      a = i.slice(0, e);
    for (const h of r)
      h instanceof Kr && (a.push(h), h.remove(), h.parent(this));
    return a.push(...i.slice(e)), this.setParsedChildren(a), this;
  }
  remove() {
    const t = this.parent();
    return t === null ? this : (t.removeChild(this), this.parent(null), this);
  }
  move(t = 1) {
    const e = this.parent();
    if (t === 0 || !e) return this;
    const r = e.children(),
      i = [];
    if (t > 0)
      for (let a = 0; a < r.length; a++) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a < u && a + 1 < r.length; a++) i[a] = r[a + 1];
        }
        i[a] = h;
      }
    else
      for (let a = r.length - 1; a >= 0; a--) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a > u && a > 0; a--) i[a] = r[a - 1];
        }
        i[a] = h;
      }
    return e.setParsedChildren(i), this;
  }
  moveUp() {
    return this.move(1);
  }
  moveDown() {
    return this.move(-1);
  }
  moveToTop() {
    return this.move(1 / 0);
  }
  moveToBottom() {
    return this.move(-1 / 0);
  }
  moveTo(t) {
    const e = this.parent();
    if (!e) return this;
    const r = e.children().indexOf(this),
      i = t - r;
    return this.move(i);
  }
  moveBelow(t, e = !1) {
    const r = this.parent();
    if (!r) return this;
    if (t.parent() !== r)
      return (
        Tt().error(
          "Cannot position nodes relative to each other if they don't belong to the same parent."
        ),
        this
      );
    const i = r.children(),
      a = i.indexOf(this),
      h = i.indexOf(t);
    if (!e && a < h) return this;
    const u = h - a - 1;
    return this.move(u);
  }
  moveAbove(t, e = !1) {
    const r = this.parent();
    if (!r) return this;
    if (t.parent() !== r)
      return (
        Tt().error(
          "Cannot position nodes relative to each other if they don't belong to the same parent."
        ),
        this
      );
    const i = r.children(),
      a = i.indexOf(this),
      h = i.indexOf(t);
    if (!e && a > h) return this;
    const u = h - a + 1;
    return this.move(u);
  }
  reparent(t) {
    const e = this.absolutePosition(),
      r = this.absoluteRotation(),
      i = this.absoluteScale();
    return (
      t.add(this),
      this.absolutePosition(e),
      this.absoluteRotation(r),
      this.absoluteScale(i),
      this
    );
  }
  removeChildren() {
    for (const t of this.realChildren) t.parent(null);
    return this.setParsedChildren([]), this;
  }
  peekChildren() {
    return this.realChildren;
  }
  findAll(t) {
    const e = [],
      r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      t(i) && e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--) r.push(a[h]);
    }
    return e;
  }
  findFirst(t) {
    const e = this.reversedChildren();
    for (; e.length > 0; ) {
      const r = e.pop();
      if (t(r)) return r;
      const i = r.children();
      for (let a = i.length - 1; a >= 0; a--) e.push(i[a]);
    }
    return null;
  }
  findLast(t) {
    const e = [],
      r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--) r.push(a[h]);
    }
    for (; e.length > 0; ) {
      const i = e.pop();
      if (t(i)) return i;
    }
    return null;
  }
  findAncestor(t) {
    let e = this.parent();
    for (; e; ) {
      if (t(e)) return e;
      e = e.parent();
    }
    return null;
  }
  childAs(t) {
    return this.children()[t] ?? null;
  }
  childrenAs() {
    return this.children();
  }
  parentAs() {
    return this.parent() ?? null;
  }
  dispose() {
    if (this.unregister) {
      (this.stateStack = []), this.unregister(), (this.unregister = null);
      for (const { signal: t } of this) t == null || t.context.dispose();
      for (const t of this.realChildren) t.dispose();
    }
  }
  clone(t = {}) {
    const e = { ...t };
    se(this.children.context.raw())
      ? e.children ?? (e.children = this.children.context.raw())
      : this.children().length > 0 &&
        (e.children ?? (e.children = this.children().map((r) => r.clone())));
    for (const { key: r, meta: i, signal: a } of this)
      if (!(!i.cloneable || r in e))
        if (i.compound)
          for (const [h, u] of i.compoundEntries) {
            if (u in e) continue;
            const g = a[h];
            g.context.isInitial() || (e[u] = g.context.raw());
          }
        else a.context.isInitial() || (e[r] = a.context.raw());
    return this.instantiate(e);
  }
  snapshotClone(t = {}) {
    const e = { ...this.getState(), ...t };
    return (
      this.children().length > 0 &&
        (e.children ??
          (e.children = this.children().map((r) => r.snapshotClone()))),
      this.instantiate(e)
    );
  }
  reactiveClone(t = {}) {
    const e = { ...t };
    this.children().length > 0 &&
      (e.children ??
        (e.children = this.children().map((r) => r.reactiveClone())));
    for (const { key: r, meta: i, signal: a } of this)
      !i.cloneable || r in e || (e[r] = () => a());
    return this.instantiate(e);
  }
  instantiate(t = {}) {
    return new this.constructor(t);
  }
  setParsedChildren(t) {
    this.children.context.setter(t), (this.realChildren = t);
  }
  spawnChildren(t, e) {
    const r = this.parseChildren(e),
      i = new Set();
    for (const a of r) {
      const h = a.parent.context.raw();
      h && h !== this && h.removeChild(a), i.add(a.key), a.parent(this);
    }
    for (const a of this.realChildren) i.has(a.key) || a.parent(null);
    (this.hasSpawnedChildren = t), (this.realChildren = r);
  }
  parseChildren(t) {
    const e = [],
      r = Array.isArray(t) ? t : [t];
    for (const i of r) i instanceof Kr && e.push(i);
    return e;
  }
  removeChild(t) {
    this.setParsedChildren(this.children().filter((e) => e !== t));
  }
  requiresCache() {
    return (
      this.cache() ||
      this.opacity() < 1 ||
      this.compositeOperation() !== "source-over" ||
      this.hasFilters() ||
      this.hasShadow() ||
      this.shaders().length > 0
    );
  }
  cacheCanvas() {
    const t = document.createElement("canvas").getContext("2d");
    if (!t) throw new Error("Could not create a cache canvas");
    return t;
  }
  cachedCanvas() {
    const t = this.cacheCanvas(),
      e = this.worldSpaceCacheBBox(),
      r = this.localToWorld();
    return (
      (t.canvas.width = e.width),
      (t.canvas.height = e.height),
      t.setTransform(r.a, r.b, r.c, r.d, r.e - e.x, r.f - e.y),
      this.draw(t),
      t
    );
  }
  getCacheBBox() {
    return new Q();
  }
  cacheBBox() {
    const t = this.getCacheBBox(),
      e = this.children(),
      r = this.cachePadding();
    if (e.length === 0) return t.addSpacing(r);
    const i = t.corners;
    for (const h of e) {
      const u = h.fullCacheBBox(),
        g = h.localToParent();
      i.push(...u.corners.map((b) => b.transformAsPoint(g)));
    }
    return Q.fromPoints(...i).addSpacing(r);
  }
  fullCacheBBox() {
    const t = this.compositeToLocal(),
      e = this.shadowOffset().transform(t),
      r = qn(this.shadowBlur(), t),
      i = this.cacheBBox().expand(this.filters.blur() * 2 + r);
    return (
      e.x < 0 ? ((i.x += e.x), (i.width -= e.x)) : (i.width += e.x),
      e.y < 0 ? ((i.y += e.y), (i.height -= e.y)) : (i.height += e.y),
      i
    );
  }
  worldSpaceCacheBBox() {
    const t = Q.fromSizeCentered(this.view().size()).expand(
        this.view().cachePadding()
      ),
      e = Q.fromPoints(...t.transformCorners(this.view().localToWorld())),
      r = Q.fromPoints(
        ...this.cacheBBox().transformCorners(this.localToWorld())
      );
    return e.intersection(r).pixelPerfect.expand(2);
  }
  parentWorldSpaceCacheBBox() {
    var t;
    return (
      ((t = this.findAncestor((e) => e.requiresCache())) == null
        ? void 0
        : t.worldSpaceCacheBBox()) ?? new Q(v.zero, Qr().getRealSize())
    );
  }
  setupDrawFromCache(t) {
    if (
      ((t.globalCompositeOperation = this.compositeOperation()),
      (t.globalAlpha *= this.opacity()),
      this.hasFilters() && (t.filter = this.filterString()),
      this.hasShadow())
    ) {
      const r = this.compositeToWorld(),
        i = this.shadowOffset().transform(r),
        a = qn(this.shadowBlur(), r);
      (t.shadowColor = this.shadowColor().serialize()),
        (t.shadowBlur = a),
        (t.shadowOffsetX = i.x),
        (t.shadowOffsetY = i.y);
    }
    const e = this.worldToLocal();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  renderFromSource(t, e, r, i) {
    this.setupDrawFromCache(t);
    const a = this.compositeOverride();
    t.drawImage(e, r, i),
      a > 0 &&
        (t.save(),
        (t.globalAlpha *= a),
        (t.globalCompositeOperation = "source-over"),
        t.drawImage(e, r, i),
        t.restore());
  }
  shaderCanvas(t, e) {
    var O, N;
    const r = this.shaders();
    if (r.length === 0) return null;
    const i = Qr(),
      a = i.getRealSize(),
      h = this.parentWorldSpaceCacheBBox(),
      u = new DOMMatrix()
        .scaleSelf(a.width / h.width, a.height / -h.height)
        .translateSelf(h.x / -a.width, h.y / a.height - 1),
      g = this.worldSpaceCacheBBox(),
      b = new DOMMatrix()
        .scaleSelf(a.width / g.width, a.height / -g.height)
        .translateSelf(g.x / -a.width, g.y / a.height - 1)
        .invertSelf(),
      x = i.shaders.getGL();
    i.shaders.copyTextures(t, e), i.shaders.clear();
    for (const Y of r) {
      const st = i.shaders.getProgram(Y.fragment);
      if (st) {
        if (Y.uniforms)
          for (const [C, tt] of Object.entries(Y.uniforms)) {
            const vt = x.getUniformLocation(st, C);
            if (vt === null) continue;
            const it = Jt(tt);
            typeof it == "number"
              ? x.uniform1f(vt, it)
              : "toUniform" in it
              ? it.toUniform(x, vt)
              : it.length === 1
              ? x.uniform1f(vt, it[0])
              : it.length === 2
              ? x.uniform2f(vt, it[0], it[1])
              : it.length === 3
              ? x.uniform3f(vt, it[0], it[1], it[2])
              : it.length === 4 && x.uniform4f(vt, it[0], it[1], it[2], it[3]);
          }
        x.uniform1f(x.getUniformLocation(st, Bi), this.view2D.globalTime()),
          x.uniform1i(x.getUniformLocation(st, Bi), i.playback.frame),
          x.uniformMatrix4fv(
            x.getUniformLocation(st, Xc),
            !1,
            b.toFloat32Array()
          ),
          x.uniformMatrix4fv(
            x.getUniformLocation(st, Hc),
            !1,
            u.toFloat32Array()
          ),
          (O = Y.setup) == null || O.call(Y, x, st),
          i.shaders.render(),
          (N = Y.teardown) == null || N.call(Y, x, st);
      }
    }
    return x.canvas;
  }
  render(t) {
    if (!(this.absoluteOpacity() <= 0)) {
      if ((t.save(), this.transformContext(t), this.requiresCache())) {
        const e = this.worldSpaceCacheBBox();
        if (e.width !== 0 && e.height !== 0) {
          const r = this.cachedCanvas().canvas,
            i = this.shaderCanvas(t.canvas, r);
          i
            ? this.renderFromSource(t, i, 0, 0)
            : this.renderFromSource(t, r, e.position.x, e.position.y);
        }
      } else this.draw(t);
      t.restore();
    }
  }
  draw(t) {
    this.drawChildren(t);
  }
  drawChildren(t) {
    for (const e of this.sortedChildren()) e.render(t);
  }
  drawOverlay(t, e) {
    const r = this.cacheBBox().transformCorners(e),
      i = this.getCacheBBox().transformCorners(e);
    (t.strokeStyle = "white"),
      (t.lineWidth = 1),
      t.beginPath(),
      fe(t, r),
      t.closePath(),
      t.stroke(),
      (t.strokeStyle = "blue"),
      t.beginPath(),
      fe(t, i),
      t.closePath(),
      t.stroke();
  }
  transformContext(t) {
    const e = this.localToParent();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  hit(t) {
    let e = null;
    const r = t.transformAsPoint(this.localToParent().inverse()),
      i = this.children();
    for (let a = i.length - 1; a >= 0 && ((e = i[a].hit(r)), !e); a--);
    return e;
  }
  collectAsyncResources() {
    for (const t of this.children()) t.collectAsyncResources();
  }
  async toPromise() {
    do await gt.consumePromises(), this.collectAsyncResources();
    while (gt.hasPromises());
    return this;
  }
  getState() {
    const t = {};
    for (const { key: e, meta: r, signal: i } of this)
      !r.cloneable || e in t || (t[e] = i());
    return t;
  }
  applyState(t, e, r = Yt) {
    if (e === void 0)
      for (const a in t) {
        const h = this.signalByKey(a);
        h && h(t[a]);
      }
    const i = [];
    for (const a in t) {
      const h = this.signalByKey(a);
      t[a] !== h.context.raw() && i.push(h(t[a], e, r));
    }
    return B(...i);
  }
  save() {
    this.stateStack.push(this.getState());
  }
  restore(t, e = Yt) {
    const r = this.stateStack.pop();
    if (r !== void 0) return this.applyState(r, t, e);
  }
  *[Symbol.iterator]() {
    for (const t in this.properties) {
      const e = this.properties[t],
        r = this.signalByKey(t);
      yield { meta: e, signal: r, key: t };
    }
  }
  signalByKey(t) {
    return this[t];
  }
  reversedChildren() {
    const t = this.children(),
      e = [];
    for (let r = t.length - 1; r >= 0; r--) e.push(t[r]);
    return e;
  }
});
W([ie()], _.prototype, "position", void 0);
W([Pr(v), Fe(!1), P()], _.prototype, "absolutePosition", void 0);
W([A(0), P()], _.prototype, "rotation", void 0);
W([Fe(!1), P()], _.prototype, "absoluteRotation", void 0);
W([A(v.one), ie("scale")], _.prototype, "scale", void 0);
W([A(v.zero), ie("skew")], _.prototype, "skew", void 0);
W([Pr(v), Fe(!1), P()], _.prototype, "absoluteScale", void 0);
W([A(0), P()], _.prototype, "zIndex", void 0);
W([A(!1), P()], _.prototype, "cache", void 0);
W([un("cachePadding")], _.prototype, "cachePadding", void 0);
W([A(!1), P()], _.prototype, "composite", void 0);
W([A("source-over"), P()], _.prototype, "compositeOperation", void 0);
W([dt()], _.prototype, "tweenCompositeOperation", null);
W([A(1), ns((n) => Lt(0, 1, n)), P()], _.prototype, "opacity", void 0);
W([D()], _.prototype, "absoluteOpacity", null);
W([ku()], _.prototype, "filters", void 0);
W([A("#0000"), wu()], _.prototype, "shadowColor", void 0);
W([A(0), P()], _.prototype, "shadowBlur", void 0);
W([ie("shadowOffset")], _.prototype, "shadowOffset", void 0);
W([A([]), ns(Cu), P()], _.prototype, "shaders", void 0);
W([D()], _.prototype, "hasFilters", null);
W([D()], _.prototype, "hasShadow", null);
W([D()], _.prototype, "filterString", null);
W([ha(!1), Fe(!1), P()], _.prototype, "spawner", void 0);
W([ha(!1), Fe(!1), P()], _.prototype, "children", void 0);
W([D()], _.prototype, "spawnedChildren", null);
W([D()], _.prototype, "sortedChildren", null);
W([D()], _.prototype, "localToWorld", null);
W([D()], _.prototype, "worldToLocal", null);
W([D()], _.prototype, "worldToParent", null);
W([D()], _.prototype, "parentToWorld", null);
W([D()], _.prototype, "localToParent", null);
W([D()], _.prototype, "compositeToWorld", null);
W([D()], _.prototype, "compositeRoot", null);
W([D()], _.prototype, "compositeToLocal", null);
W([D()], _.prototype, "cacheCanvas", null);
W([D()], _.prototype, "cachedCanvas", null);
W([D()], _.prototype, "cacheBBox", null);
W([D()], _.prototype, "fullCacheBBox", null);
W([D()], _.prototype, "worldSpaceCacheBBox", null);
W([D()], _.prototype, "parentWorldSpaceCacheBBox", null);
_ = Kr = W([ae("Node")], _);
_.prototype.isClass = !0;
var z =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  tn;
let $ = (tn = class extends _ {
  get columnGap() {
    return this.gap.x;
  }
  get rowGap() {
    return this.gap.y;
  }
  getX() {
    return this.isLayoutRoot()
      ? this.x.context.getter()
      : this.computedPosition().x;
  }
  setX(t) {
    this.x.context.setter(t);
  }
  getY() {
    return this.isLayoutRoot()
      ? this.y.context.getter()
      : this.computedPosition().y;
  }
  setY(t) {
    this.y.context.setter(t);
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  getWidth() {
    return this.computedSize().width;
  }
  setWidth(t) {
    this.width.context.setter(t);
  }
  *tweenWidth(t, e, r, i) {
    const a = this.desiredSize().x,
      h = typeof a != "number" || typeof t != "number";
    let u;
    h ? (u = this.size.x()) : (u = a);
    let g;
    h ? (this.size.x(t), (g = this.size.x())) : (g = t),
      this.size.x(u),
      h && this.lockSize(),
      yield* Ut(e, (b) => this.size.x(i(u, g, r(b)))),
      this.size.x(t),
      h && this.releaseSize();
  }
  getHeight() {
    return this.computedSize().height;
  }
  setHeight(t) {
    this.height.context.setter(t);
  }
  *tweenHeight(t, e, r, i) {
    const a = this.desiredSize().y,
      h = typeof a != "number" || typeof t != "number";
    let u;
    h ? (u = this.size.y()) : (u = a);
    let g;
    h ? (this.size.y(t), (g = this.size.y())) : (g = t),
      this.size.y(u),
      h && this.lockSize(),
      yield* Ut(e, (b) => this.size.y(i(u, g, r(b)))),
      this.size.y(t),
      h && this.releaseSize();
  }
  desiredSize() {
    return { x: this.width.context.getter(), y: this.height.context.getter() };
  }
  *tweenSize(t, e, r, i) {
    const a = this.desiredSize();
    let h;
    typeof a.x != "number" || typeof a.y != "number"
      ? (h = this.size())
      : (h = new v(a));
    let u;
    typeof t == "object" && typeof t.x == "number" && typeof t.y == "number"
      ? (u = new v(t))
      : (this.size(t), (u = this.size())),
      this.size(h),
      this.lockSize(),
      yield* Ut(e, (g) => this.size(i(h, u, r(g)))),
      this.releaseSize(),
      this.size(t);
  }
  cardinalPoint(t) {
    switch (t) {
      case ft.TopLeft:
        return this.topLeft;
      case ft.TopRight:
        return this.topRight;
      case ft.BottomLeft:
        return this.bottomLeft;
      case ft.BottomRight:
        return this.bottomRight;
      case ft.Top:
      case $t.Top:
        return this.top;
      case ft.Bottom:
      case $t.Bottom:
        return this.bottom;
      case ft.Left:
      case $t.Left:
        return this.left;
      case ft.Right:
      case $t.Right:
        return this.right;
      default:
        return this.middle;
    }
  }
  constructor(t) {
    super(t), (this.element.dataset.motionCanvasKey = this.key);
  }
  lockSize() {
    this.sizeLockCounter(this.sizeLockCounter() + 1);
  }
  releaseSize() {
    this.sizeLockCounter(this.sizeLockCounter() - 1);
  }
  parentTransform() {
    return this.findAncestor(is(tn));
  }
  anchorPosition() {
    const t = this.computedSize(),
      e = this.offset();
    return t.scale(0.5).mul(e);
  }
  layoutEnabled() {
    var t;
    return (
      this.layout() ??
      ((t = this.parentTransform()) == null ? void 0 : t.layoutEnabled()) ??
      !1
    );
  }
  isLayoutRoot() {
    var t;
    return (
      !this.layoutEnabled() ||
      !((t = this.parentTransform()) != null && t.layoutEnabled())
    );
  }
  localToParent() {
    const t = super.localToParent(),
      e = this.offset();
    if (!e.exactlyEquals(v.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  scalingRotationMatrix() {
    const t = new DOMMatrix();
    t.rotateSelf(0, 0, this.rotation()),
      t.scaleSelf(this.scale.x(), this.scale.y());
    const e = this.offset();
    if (!e.exactlyEquals(v.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  getComputedLayout() {
    return new Q(this.element.getBoundingClientRect());
  }
  computedPosition() {
    this.requestLayoutUpdate();
    const t = this.getComputedLayout(),
      e = new v(
        t.x + (t.width / 2) * this.offset.x(),
        t.y + (t.height / 2) * this.offset.y()
      ),
      r = this.parentTransform();
    if (r) {
      const i = r.getComputedLayout();
      (e.x -= i.x + (i.width - t.width) / 2),
        (e.y -= i.y + (i.height - t.height) / 2);
    }
    return e;
  }
  computedSize() {
    return this.requestLayoutUpdate(), this.getComputedLayout().size;
  }
  requestLayoutUpdate() {
    const t = this.parentTransform();
    this.appendedToView()
      ? (t == null || t.requestFontUpdate(), this.updateLayout())
      : t.requestLayoutUpdate();
  }
  appendedToView() {
    const t = this.isLayoutRoot();
    return t && this.view().element.append(this.element), t;
  }
  updateLayout() {
    if ((this.applyFont(), this.applyFlex(), this.layoutEnabled())) {
      const t = this.layoutChildren();
      for (const e of t) e.updateLayout();
    }
  }
  layoutChildren() {
    const t = [...this.children()],
      e = [],
      r = [];
    for (; t.length; ) {
      const i = t.shift();
      i instanceof tn
        ? i.layoutEnabled() && (e.push(i), r.push(i.element))
        : i && t.unshift(...i.children());
    }
    return this.element.replaceChildren(...r), e;
  }
  requestFontUpdate() {
    var t;
    this.appendedToView(),
      (t = this.parentTransform()) == null || t.requestFontUpdate(),
      this.applyFont();
  }
  getCacheBBox() {
    return Q.fromSizeCentered(this.computedSize());
  }
  draw(t) {
    if (this.clip()) {
      const e = this.computedSize();
      if (e.width === 0 || e.height === 0) return;
      t.beginPath(),
        t.rect(e.width / -2, e.height / -2, e.width, e.height),
        t.closePath(),
        t.clip();
    }
    this.drawChildren(t);
  }
  drawOverlay(t, e) {
    const r = this.computedSize(),
      i = r.mul(this.offset()).scale(0.5).transformAsPoint(e),
      a = Q.fromSizeCentered(r),
      h = a.transformCorners(e),
      u = a.addSpacing(this.padding().scale(-1)).transformCorners(e),
      g = a.addSpacing(this.margin()).transformCorners(e);
    t.beginPath(),
      fe(t, g),
      fe(t, h),
      t.closePath(),
      (t.fillStyle = "rgba(255,193,125,0.6)"),
      t.fill("evenodd"),
      t.beginPath(),
      fe(t, h),
      fe(t, u),
      t.closePath(),
      (t.fillStyle = "rgba(180,255,147,0.6)"),
      t.fill("evenodd"),
      t.beginPath(),
      fe(t, h),
      t.closePath(),
      (t.lineWidth = 1),
      (t.strokeStyle = "white"),
      t.stroke(),
      t.beginPath(),
      ua(t, i),
      t.stroke();
  }
  getOriginDelta(t) {
    const e = this.computedSize().scale(0.5),
      r = this.offset().mul(e);
    return t === ft.Middle ? r.flipped : au(t).mul(e).sub(r);
  }
  moveOffset(t) {
    const e = this.computedSize().scale(0.5),
      r = this.offset().mul(e),
      i = t.mul(e);
    this.offset(t), this.position(this.position().add(i).sub(r));
  }
  parsePixels(t) {
    return t === null ? "" : `${t}px`;
  }
  parseLength(t) {
    return t === null ? "" : typeof t == "string" ? t : `${t}px`;
  }
  applyFlex() {
    this.element.style.position = this.isLayoutRoot() ? "absolute" : "relative";
    const t = this.desiredSize();
    (this.element.style.width = this.parseLength(t.x)),
      (this.element.style.height = this.parseLength(t.y)),
      (this.element.style.maxWidth = this.parseLength(this.maxWidth())),
      (this.element.style.minWidth = this.parseLength(this.minWidth())),
      (this.element.style.maxHeight = this.parseLength(this.maxHeight())),
      (this.element.style.minHeight = this.parseLength(this.minHeight())),
      (this.element.style.aspectRatio =
        this.ratio() === null ? "" : this.ratio().toString()),
      (this.element.style.marginTop = this.parsePixels(this.margin.top())),
      (this.element.style.marginBottom = this.parsePixels(
        this.margin.bottom()
      )),
      (this.element.style.marginLeft = this.parsePixels(this.margin.left())),
      (this.element.style.marginRight = this.parsePixels(this.margin.right())),
      (this.element.style.paddingTop = this.parsePixels(this.padding.top())),
      (this.element.style.paddingBottom = this.parsePixels(
        this.padding.bottom()
      )),
      (this.element.style.paddingLeft = this.parsePixels(this.padding.left())),
      (this.element.style.paddingRight = this.parsePixels(
        this.padding.right()
      )),
      (this.element.style.flexDirection = this.direction()),
      (this.element.style.flexBasis = this.parseLength(this.basis())),
      (this.element.style.flexWrap = this.wrap()),
      (this.element.style.justifyContent = this.justifyContent()),
      (this.element.style.alignContent = this.alignContent()),
      (this.element.style.alignItems = this.alignItems()),
      (this.element.style.alignSelf = this.alignSelf()),
      (this.element.style.columnGap = this.parseLength(this.gap.x())),
      (this.element.style.rowGap = this.parseLength(this.gap.y())),
      this.sizeLockCounter() > 0
        ? ((this.element.style.flexGrow = "0"),
          (this.element.style.flexShrink = "0"))
        : ((this.element.style.flexGrow = this.grow().toString()),
          (this.element.style.flexShrink = this.shrink().toString()));
  }
  applyFont() {
    if (
      ((this.element.style.fontFamily = this.fontFamily.isInitial()
        ? ""
        : this.fontFamily()),
      (this.element.style.fontSize = this.fontSize.isInitial()
        ? ""
        : `${this.fontSize()}px`),
      (this.element.style.fontStyle = this.fontStyle.isInitial()
        ? ""
        : this.fontStyle()),
      this.lineHeight.isInitial())
    )
      this.element.style.lineHeight = "";
    else {
      const t = this.lineHeight();
      this.element.style.lineHeight =
        typeof t == "string" ? (parseFloat(t) / 100).toString() : `${t}px`;
    }
    if (
      ((this.element.style.fontWeight = this.fontWeight.isInitial()
        ? ""
        : this.fontWeight().toString()),
      (this.element.style.letterSpacing = this.letterSpacing.isInitial()
        ? ""
        : `${this.letterSpacing()}px`),
      (this.element.style.textAlign = this.textAlign.isInitial()
        ? ""
        : this.textAlign()),
      this.textWrap.isInitial())
    )
      this.element.style.whiteSpace = "";
    else {
      const t = this.textWrap();
      typeof t == "boolean"
        ? (this.element.style.whiteSpace = t ? "normal" : "nowrap")
        : (this.element.style.whiteSpace = t);
    }
  }
  dispose() {
    var t;
    super.dispose(),
      (t = this.sizeLockCounter) == null || t.context.dispose(),
      this.element && (this.element.remove(), (this.element.innerHTML = "")),
      (this.element = null),
      (this.styles = null);
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent().inverse());
    return this.cacheBBox().includes(e) ? super.hit(t) ?? this : null;
  }
});
z([A(null), rs(tu), P()], $.prototype, "layout", void 0);
z([A(null), P()], $.prototype, "maxWidth", void 0);
z([A(null), P()], $.prototype, "maxHeight", void 0);
z([A(null), P()], $.prototype, "minWidth", void 0);
z([A(null), P()], $.prototype, "minHeight", void 0);
z([A(null), P()], $.prototype, "ratio", void 0);
z([un("margin")], $.prototype, "margin", void 0);
z([un("padding")], $.prototype, "padding", void 0);
z([A("row"), P()], $.prototype, "direction", void 0);
z([A(null), P()], $.prototype, "basis", void 0);
z([A(0), P()], $.prototype, "grow", void 0);
z([A(1), P()], $.prototype, "shrink", void 0);
z([A("nowrap"), P()], $.prototype, "wrap", void 0);
z([A("start"), P()], $.prototype, "justifyContent", void 0);
z([A("normal"), P()], $.prototype, "alignContent", void 0);
z([A("stretch"), P()], $.prototype, "alignItems", void 0);
z([A("auto"), P()], $.prototype, "alignSelf", void 0);
z([A(0), ie({ x: "columnGap", y: "rowGap" })], $.prototype, "gap", void 0);
z([we("font-family"), P()], $.prototype, "fontFamily", void 0);
z([we("font-size", parseFloat), P()], $.prototype, "fontSize", void 0);
z([we("font-style"), P()], $.prototype, "fontStyle", void 0);
z([we("font-weight", parseInt), P()], $.prototype, "fontWeight", void 0);
z([we("line-height", parseFloat), P()], $.prototype, "lineHeight", void 0);
z(
  [we("letter-spacing", (n) => (n === "normal" ? 0 : parseFloat(n))), P()],
  $.prototype,
  "letterSpacing",
  void 0
);
z(
  [we("white-space", (n) => (n === "pre" ? "pre" : n === "normal")), P()],
  $.prototype,
  "textWrap",
  void 0
);
z([A("inherit"), P()], $.prototype, "textDirection", void 0);
z([we("text-align"), P()], $.prototype, "textAlign", void 0);
z(
  [A({ x: null, y: null }), ie({ x: "width", y: "height" })],
  $.prototype,
  "size",
  void 0
);
z([dt()], $.prototype, "tweenWidth", null);
z([dt()], $.prototype, "tweenHeight", null);
z([D()], $.prototype, "desiredSize", null);
z([dt()], $.prototype, "tweenSize", null);
z([ie("offset")], $.prototype, "offset", void 0);
z([oe(ft.Middle)], $.prototype, "middle", void 0);
z([oe(ft.Top)], $.prototype, "top", void 0);
z([oe(ft.Bottom)], $.prototype, "bottom", void 0);
z([oe(ft.Left)], $.prototype, "left", void 0);
z([oe(ft.Right)], $.prototype, "right", void 0);
z([oe(ft.TopLeft)], $.prototype, "topLeft", void 0);
z([oe(ft.TopRight)], $.prototype, "topRight", void 0);
z([oe(ft.BottomLeft)], $.prototype, "bottomLeft", void 0);
z([oe(ft.BottomRight)], $.prototype, "bottomRight", void 0);
z([A(!1), P()], $.prototype, "clip", void 0);
z([A(0), P()], $.prototype, "sizeLockCounter", void 0);
z([D()], $.prototype, "parentTransform", null);
z([D()], $.prototype, "anchorPosition", null);
z([D()], $.prototype, "layoutEnabled", null);
z([D()], $.prototype, "isLayoutRoot", null);
z([D()], $.prototype, "scalingRotationMatrix", null);
z([D()], $.prototype, "computedPosition", null);
z([D()], $.prototype, "computedSize", null);
z([D()], $.prototype, "requestLayoutUpdate", null);
z([D()], $.prototype, "appendedToView", null);
z([D()], $.prototype, "updateLayout", null);
z([D()], $.prototype, "layoutChildren", null);
z([D()], $.prototype, "requestFontUpdate", null);
z([D()], $.prototype, "applyFlex", null);
z([D()], $.prototype, "applyFont", null);
$ = tn = z([ae("Layout")], $);
function oe(n) {
  return (t, e) => {
    P()(t, e), Fe(!1)(t, e);
    const r = Oe(t, e);
    (r.parser = (i) => new v(i)),
      (r.getter = function () {
        return this.computedSize()
          .getOriginOffset(n)
          .transformAsPoint(this.localToParent());
      }),
      (r.setter = function (i) {
        return (
          this.position(
            Me(i, (a) =>
              this.getOriginDelta(n)
                .transform(this.scalingRotationMatrix())
                .flipped.add(a)
            )
          ),
          this
        );
      });
  };
}
Cr($.prototype, (n) => {
  (n.element = document.createElement("div")),
    (n.element.style.display = "flex"),
    (n.element.style.boxSizing = "border-box"),
    (n.styles = getComputedStyle(n.element));
});
var Ft =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
let Ct = class extends $ {
  rippleSize() {
    return ru(this.rippleStrength(), 0, 50);
  }
  constructor(t) {
    super(t), (this.rippleStrength = ze(0));
  }
  applyText(t) {
    (t.direction = this.textDirection()),
      (this.element.dir = this.textDirection());
  }
  applyStyle(t) {
    (t.fillStyle = Hn(this.fill(), t)),
      (t.strokeStyle = Hn(this.stroke(), t)),
      (t.lineWidth = this.lineWidth()),
      (t.lineJoin = this.lineJoin()),
      (t.lineCap = this.lineCap()),
      t.setLineDash(this.lineDash()),
      (t.lineDashOffset = this.lineDashOffset()),
      this.antialiased() ||
        (t.filter =
          "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)");
  }
  draw(t) {
    this.drawShape(t),
      this.clip() && t.clip(this.getPath()),
      this.drawChildren(t);
  }
  drawShape(t) {
    const e = this.getPath(),
      r = this.lineWidth() > 0 && this.stroke() !== null,
      i = this.fill() !== null;
    t.save(),
      this.applyStyle(t),
      this.drawRipple(t),
      this.strokeFirst()
        ? (r && t.stroke(e), i && t.fill(e))
        : (i && t.fill(e), r && t.stroke(e)),
      t.restore();
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.lineWidth() / 2);
  }
  getPath() {
    return new Path2D();
  }
  getRipplePath() {
    return new Path2D();
  }
  drawRipple(t) {
    const e = this.rippleStrength();
    if (e > 0) {
      const r = this.getRipplePath();
      t.save(), (t.globalAlpha *= ot(0.54, 0, e)), t.fill(r), t.restore();
    }
  }
  *ripple(t = 1) {
    this.rippleStrength(0),
      yield* this.rippleStrength(1, t, nu),
      this.rippleStrength(0);
  }
};
Ft([da()], Ct.prototype, "fill", void 0);
Ft([da()], Ct.prototype, "stroke", void 0);
Ft([A(!1), P()], Ct.prototype, "strokeFirst", void 0);
Ft([A(0), P()], Ct.prototype, "lineWidth", void 0);
Ft([A("miter"), P()], Ct.prototype, "lineJoin", void 0);
Ft([A("butt"), P()], Ct.prototype, "lineCap", void 0);
Ft([A([]), P()], Ct.prototype, "lineDash", void 0);
Ft([A(0), P()], Ct.prototype, "lineDashOffset", void 0);
Ft([A(!0), P()], Ct.prototype, "antialiased", void 0);
Ft([D()], Ct.prototype, "rippleSize", null);
Ft([D()], Ct.prototype, "getPath", null);
Ft([dt()], Ct.prototype, "ripple", null);
Ct = Ft([ae("Shape")], Ct);
var Gt =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
let At = class extends Ct {
  desiredSize() {
    return this.childrenBBox().size;
  }
  constructor(t) {
    super(t), (this.canHaveSubpath = !1);
  }
  percentageToDistance(t) {
    return Lt(
      0,
      this.baseArcLength(),
      this.startOffset() + this.offsetArcLength() * t
    );
  }
  distanceToPercentage(t) {
    return (t - this.startOffset()) / this.offsetArcLength();
  }
  baseArcLength() {
    return this.profile().arcLength;
  }
  offsetArcLength() {
    const t = this.startOffset(),
      e = this.endOffset(),
      r = this.baseArcLength();
    return Lt(0, r, r - t - e);
  }
  arcLength() {
    return this.offsetArcLength() * Math.abs(this.start() - this.end());
  }
  completion() {
    return Math.abs(this.start() - this.end());
  }
  processSubpath(t, e, r) {}
  curveDrawingInfo() {
    const t = new Path2D();
    let e = new Path2D();
    const r = this.profile();
    let i = this.percentageToDistance(this.start()),
      a = this.percentageToDistance(this.end());
    i > a && ([i, a] = [a, i]);
    const h = a - i,
      u = Math.min(h / 2, this.arrowSize());
    this.startArrow() && (i += u / 2), this.endArrow() && (a -= u / 2);
    let g = 0,
      b = null,
      x = null,
      O = null,
      N = null;
    for (const Y of r.segments) {
      const st = g;
      if (((g += Y.arcLength), g < i)) continue;
      const C = (i - st) / Y.arcLength,
        tt = (a - st) / Y.arcLength,
        vt = Lt(0, 1, C),
        it = Lt(0, 1, tt);
      this.canHaveSubpath &&
        O &&
        !Y.getPoint(0).position.equals(O) &&
        (t.addPath(e),
        this.processSubpath(e, b, O),
        (e = new Path2D()),
        (b = null));
      const [It, Pt] = Y.draw(e, vt, it, b === null);
      if (
        (b === null &&
          ((b = It.position), (x = It.normal.flipped.perpendicular)),
        (O = Pt.position),
        (N = Pt.normal.flipped.perpendicular),
        g > a)
      )
        break;
    }
    return (
      this.closed() &&
        this.start.isInitial() &&
        this.end.isInitial() &&
        this.startOffset.isInitial() &&
        this.endOffset.isInitial() &&
        e.closePath(),
      this.processSubpath(e, b, O),
      t.addPath(e),
      {
        startPoint: b ?? v.zero,
        startTangent: x ?? v.right,
        endPoint: O ?? v.zero,
        endTangent: N ?? v.right,
        arrowSize: u,
        path: t,
        startOffset: i,
      }
    );
  }
  getPointAtDistance(t) {
    return Xi(this.profile(), t + this.startOffset());
  }
  getPointAtPercentage(t) {
    return Xi(this.profile(), this.percentageToDistance(t));
  }
  getComputedLayout() {
    return this.offsetComputedLayout(super.getComputedLayout());
  }
  offsetComputedLayout(t) {
    return (t.position = t.position.sub(this.childrenBBox().center)), t;
  }
  getPath() {
    return this.curveDrawingInfo().path;
  }
  getCacheBBox() {
    const t = this.childrenBBox(),
      e = this.startArrow() || this.endArrow() ? this.arrowSize() : 0,
      r = this.lineWidth(),
      i = this.lineWidthCoefficient();
    return t.expand(Math.max(0, e, r * i));
  }
  lineWidthCoefficient() {
    return this.lineCap() === "square" ? 0.5 * 1.4143 : 0.5;
  }
  requiresProfile() {
    return (
      !this.start.isInitial() ||
      !this.startOffset.isInitial() ||
      !this.startArrow.isInitial() ||
      !this.end.isInitial() ||
      !this.endOffset.isInitial() ||
      !this.endArrow.isInitial()
    );
  }
  drawShape(t) {
    super.drawShape(t),
      (this.startArrow() || this.endArrow()) && this.drawArrows(t);
  }
  drawArrows(t) {
    const {
      startPoint: e,
      startTangent: r,
      endPoint: i,
      endTangent: a,
      arrowSize: h,
    } = this.curveDrawingInfo();
    h < 0.001 ||
      (t.save(),
      t.beginPath(),
      this.endArrow() && this.drawArrow(t, i, a.flipped, h),
      this.startArrow() && this.drawArrow(t, e, r, h),
      (t.fillStyle = Hn(this.stroke(), t)),
      t.closePath(),
      t.fill(),
      t.restore());
  }
  drawArrow(t, e, r, i) {
    const a = r.perpendicular,
      h = e.add(r.scale(-i / 2));
    Lr(t, h),
      Vt(t, h.add(r.add(a).scale(i))),
      Vt(t, h.add(r.sub(a).scale(i))),
      Vt(t, h),
      t.closePath();
  }
};
Gt([A(!1), P()], At.prototype, "closed", void 0);
Gt([A(0), P()], At.prototype, "start", void 0);
Gt([A(0), P()], At.prototype, "startOffset", void 0);
Gt([A(!1), P()], At.prototype, "startArrow", void 0);
Gt([A(1), P()], At.prototype, "end", void 0);
Gt([A(0), P()], At.prototype, "endOffset", void 0);
Gt([A(!1), P()], At.prototype, "endArrow", void 0);
Gt([A(24), P()], At.prototype, "arrowSize", void 0);
Gt([D()], At.prototype, "arcLength", null);
Gt([D()], At.prototype, "curveDrawingInfo", null);
At = Gt([ae("Curve")], At);
class as {}
class pa extends as {
  constructor(t, e, r, i, a) {
    super(),
      (this.center = t),
      (this.radius = e),
      (this.from = r),
      (this.to = i),
      (this.counter = a),
      (this.angle = Math.acos(Lt(-1, 1, r.dot(i)))),
      (this.length = Math.abs(this.angle * e));
    const h = new v(1, 1).scale(e);
    this.points = [t.sub(h), t.add(h)];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e, r) {
    const i = this.counter ? -1 : 1,
      a = this.from.radians + e * this.angle * i,
      h = this.to.radians - (1 - r) * this.angle * i;
    Math.abs(this.angle) > 1e-4 &&
      t.arc(this.center.x, this.center.y, this.radius, a, h, this.counter);
    const u = v.fromRadians(a),
      g = v.fromRadians(h);
    return [
      {
        position: this.center.add(u.scale(this.radius)),
        tangent: this.counter ? u : u.flipped,
        normal: this.counter ? u.flipped : u,
      },
      {
        position: this.center.add(g.scale(this.radius)),
        tangent: this.counter ? g.flipped : g,
        normal: this.counter ? g.flipped : g,
      },
    ];
  }
  getPoint(t) {
    const e = this.counter ? -1 : 1,
      r = this.from.radians + t * this.angle * e,
      i = v.fromRadians(r);
    return {
      position: this.center.add(i.scale(this.radius)),
      tangent: this.counter ? i : i.flipped,
      normal: this.counter ? i : i.flipped,
    };
  }
}
class Rt {
  static constant(t) {
    return new Rt(t);
  }
  static linear(t, e) {
    return new Rt(t, e);
  }
  static quadratic(t, e, r) {
    return new Rt(t, e, r);
  }
  static cubic(t, e, r, i) {
    return new Rt(t, e, r, i);
  }
  get degree() {
    return this.c3 !== 0 ? 3 : this.c2 !== 0 ? 2 : this.c1 !== 0 ? 1 : 0;
  }
  constructor(t, e, r, i) {
    (this.c0 = t), (this.c1 = e ?? 0), (this.c2 = r ?? 0), (this.c3 = i ?? 0);
  }
  differentiate(t = 1) {
    switch (t) {
      case 0:
        return this;
      case 1:
        return new Rt(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new Rt(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new Rt(6 * this.c3, 0, 0, 0);
      default:
        throw new Error("Unsupported derivative");
    }
  }
  eval(t, e = 0) {
    return e !== 0
      ? this.differentiate(e).eval(t)
      : this.c3 * (t * t * t) + this.c2 * (t * t) + this.c1 * t + this.c0;
  }
  split(t) {
    const e = 1 - t,
      r = new Rt(this.c0, this.c1 * t, this.c2 * t * t, this.c3 * t * t * t),
      i = new Rt(
        this.eval(0),
        e * this.differentiate(1).eval(t),
        ((e * e) / 2) * this.differentiate(2).eval(t),
        ((e * e * e) / 6) * this.differentiate(3).eval(t)
      );
    return [r, i];
  }
  roots() {
    switch (this.degree) {
      case 3:
        return this.solveCubicRoots();
      case 2:
        return this.solveQuadraticRoots();
      case 1:
        return this.solveLinearRoot();
      case 0:
        return [];
      default:
        throw new Error(`Unsupported polynomial degree: ${this.degree}`);
    }
  }
  localExtrema() {
    return this.differentiate().roots();
  }
  localExtrema01() {
    const t = this.localExtrema(),
      e = [];
    for (let r = 0; r < t.length; r++) {
      const i = t[r];
      i >= 0 && i <= 1 && e.push(t[r]);
    }
    return e;
  }
  outputRange01() {
    let t = [this.eval(0), this.eval(1)];
    const e = (r) => {
      t[1] > t[0]
        ? (t = [Math.min(t[0], r), Math.max(t[1], r)])
        : (t = [Math.min(t[1], r), Math.max(t[0], r)]);
    };
    return this.localExtrema01().forEach((r) => e(this.eval(r))), t;
  }
  solveCubicRoots() {
    const t = this.c0,
      e = this.c1,
      r = this.c2,
      i = this.c3,
      a = t * t,
      h = t * r,
      u = e * e,
      g = (3 * h - u) / (3 * a),
      b = (2 * u * e - 9 * h * e + 27 * a * i) / (27 * a * t),
      x = this.solveDepressedCubicRoots(g, b),
      O = (N) => N - e / (3 * t);
    switch (x.length) {
      case 1:
        return [O(x[0])];
      case 2:
        return [O(x[0]), O(x[1])];
      case 3:
        return [O(x[0]), O(x[1]), O(x[2])];
      default:
        return [];
    }
  }
  solveDepressedCubicRoots(t, e) {
    if (this.almostZero(t)) return [Math.cbrt(-e)];
    const r = Math.PI * 2,
      i = 4 * t * t * t + 27 * e * e;
    if (i < 1e-5) {
      const a = 2 * Math.sqrt(-t / 3),
        h = ((3 * e) / (2 * t)) * Math.sqrt(-3 / t),
        u = (g) =>
          a * Math.cos((1 / 3) * Math.acos(Lt(-1, 1, h)) - (r / 3) * g);
      return h >= 0.9999
        ? [u(0), u(2)]
        : h <= -0.9999
        ? [u(1), u(2)]
        : [u(0), u(1), u(2)];
    }
    if (i > 0 && t < 0) {
      const a =
        0.3333333333333333 *
        Math.acosh(((-3 * Math.abs(e)) / (2 * t)) * Math.sqrt(-3 / t));
      return [-2 * Math.sign(e) * Math.sqrt(-t / 3) * Math.cosh(a)];
    }
    if (t > 0) {
      const a =
        0.3333333333333333 * Math.asinh(((3 * e) / (2 * t)) * Math.sqrt(3 / t));
      return [-2 * Math.sqrt(t / 3) * Math.sinh(a)];
    }
    return [];
  }
  solveQuadraticRoots() {
    const t = this.c2,
      e = this.c1,
      r = this.c0,
      i = e * e - 4 * t * r;
    if (this.almostZero(i)) return [-e / (2 * t)];
    if (i >= 0) {
      const a = Math.sqrt(i),
        h = (-e - a) / (2 * t),
        u = (-e + a) / (2 * t);
      return [Math.min(h, u), Math.max(h, u)];
    }
    return [];
  }
  solveLinearRoot() {
    return [-this.c0 / this.c1];
  }
  almostZero(t) {
    return Math.abs(0 - t) <= Number.EPSILON;
  }
}
class yr {
  constructor(t, e, r, i) {
    (this.c0 = t),
      (this.c1 = e),
      (this.c2 = r),
      (this.c3 = i),
      t instanceof Rt
        ? ((this.x = t), (this.y = e))
        : i !== void 0
        ? ((this.x = new Rt(t.x, e.x, r.x, i.x)),
          (this.y = new Rt(t.y, e.y, r.y, i.y)))
        : ((this.x = new Rt(t.x, e.x, r.x)), (this.y = new Rt(t.y, e.y, r.y)));
  }
  eval(t, e = 0) {
    return new v(
      this.x.differentiate(e).eval(t),
      this.y.differentiate(e).eval(t)
    );
  }
  split(t) {
    const [e, r] = this.x.split(t),
      [i, a] = this.y.split(t);
    return [new yr(e, i), new yr(r, a)];
  }
  differentiate(t = 1) {
    return new yr(this.x.differentiate(t), this.y.differentiate(t));
  }
  evalDerivative(t) {
    return this.differentiate().eval(t);
  }
  getBounds() {
    const t = this.x.outputRange01(),
      e = this.y.outputRange01();
    return Q.fromPoints(
      new v(Math.min(...t), Math.max(...e)),
      new v(Math.max(...t), Math.min(...e))
    );
  }
}
class Pu {
  constructor(t, e = 20) {
    (this.curve = t), (this.sampledDistances = []), this.resample(e);
  }
  resample(t) {
    this.sampledDistances = [0];
    let e = 0,
      r = this.curve.eval(0).position;
    for (let i = 1; i < t; i++) {
      const a = i / (t - 1),
        h = this.curve.eval(a),
        u = r.sub(h.position).magnitude;
      (e += u), this.sampledDistances.push(e), (r = h.position);
    }
    this.sampledDistances[this.sampledDistances.length - 1] =
      this.curve.arcLength;
  }
  pointAtDistance(t) {
    return this.curve.eval(this.distanceToT(t));
  }
  distanceToT(t) {
    const e = this.sampledDistances.length;
    t = Lt(0, this.curve.arcLength, t);
    for (let r = 0; r < e; r++) {
      const i = this.sampledDistances[r],
        a = this.sampledDistances[r + 1];
      if (t >= i && t <= a) return eu(i, a, r / (e - 1), (r + 1) / (e - 1), t);
    }
    return 1;
  }
}
class Ru extends as {
  get arcLength() {
    return this.length;
  }
  constructor(t, e) {
    super(),
      (this.curve = t),
      (this.length = e),
      (this.pointSampler = new Pu(this));
  }
  getBBox() {
    return this.curve.getBounds();
  }
  eval(t) {
    const e = this.tangent(t);
    return {
      position: this.curve.eval(t),
      tangent: e,
      normal: e.perpendicular,
    };
  }
  getPoint(t) {
    const e = this.pointSampler.pointAtDistance(this.arcLength * t);
    return {
      position: e.position,
      tangent: e.tangent,
      normal: e.tangent.perpendicular,
    };
  }
  transformPoints(t) {
    return this.points.map((e) => e.transformAsPoint(t));
  }
  tangent(t) {
    return this.curve.evalDerivative(t).normalized;
  }
  draw(t, e = 0, r = 1, i = !0) {
    let a = null,
      h = e,
      u = r,
      g = this.points;
    if (e !== 0 || r !== 1) {
      const O = this.length * e,
        N = this.length * r;
      (h = this.pointSampler.distanceToT(O)),
        (u = this.pointSampler.distanceToT(N));
      const Y = (u - h) / (1 - h),
        [, st] = this.split(h);
      ([a] = st.split(Y)), (g = a.points);
    }
    i && Lr(t, g[0]), (a ?? this).doDraw(t);
    const b = this.tangent(h),
      x = this.tangent(u);
    return [
      { position: g[0], tangent: b, normal: b.perpendicular },
      { position: g.at(-1), tangent: x, normal: x.perpendicular },
    ];
  }
}
var Lu =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
class de extends Ru {
  get points() {
    return [this.p0, this.p1, this.p2, this.p3];
  }
  constructor(t, e, r, i) {
    super(
      new yr(
        t,
        t.flipped.add(e).scale(3),
        t.scale(3).sub(e.scale(6)).add(r.scale(3)),
        t.flipped.add(e.scale(3)).sub(r.scale(3)).add(i)
      ),
      de.getLength(t, e, r, i)
    ),
      (this.p0 = t),
      (this.p1 = e),
      (this.p2 = r),
      (this.p3 = i);
  }
  split(t) {
    const e = new v(
        this.p0.x + (this.p1.x - this.p0.x) * t,
        this.p0.y + (this.p1.y - this.p0.y) * t
      ),
      r = new v(
        this.p1.x + (this.p2.x - this.p1.x) * t,
        this.p1.y + (this.p2.y - this.p1.y) * t
      ),
      i = new v(
        this.p2.x + (this.p3.x - this.p2.x) * t,
        this.p2.y + (this.p3.y - this.p2.y) * t
      ),
      a = new v(e.x + (r.x - e.x) * t, e.y + (r.y - e.y) * t),
      h = new v(r.x + (i.x - r.x) * t, r.y + (i.y - r.y) * t),
      u = new v(a.x + (h.x - a.x) * t, a.y + (h.y - a.y) * t),
      g = new de(this.p0, e, a, u),
      b = new de(u, h, i, this.p3);
    return [g, b];
  }
  doDraw(t) {
    bu(t, this.p1, this.p2, this.p3);
  }
  static getLength(t, e, r, i) {
    return (
      de.el.setAttribute(
        "d",
        `M ${t.x} ${t.y} C ${e.x} ${e.y} ${r.x} ${r.y} ${i.x} ${i.y}`
      ),
      de.el.getTotalLength()
    );
  }
}
Lu(
  [ln(() => document.createElementNS("http://www.w3.org/2000/svg", "path"))],
  de,
  "el",
  void 0
);
class Ve extends as {
  constructor(t, e) {
    super(),
      (this.from = t),
      (this.to = e),
      (this.vector = e.sub(t)),
      (this.length = this.vector.magnitude),
      (this.normal = this.vector.perpendicular.normalized.safe),
      (this.points = [t, e]);
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e = 0, r = 1, i = !1) {
    const a = this.from.add(this.vector.scale(e)),
      h = this.from.add(this.vector.scale(r));
    return (
      i && Lr(t, a),
      Vt(t, h),
      [
        { position: a, tangent: this.normal.flipped, normal: this.normal },
        { position: h, tangent: this.normal, normal: this.normal },
      ]
    );
  }
  getPoint(t) {
    return {
      position: this.from.add(this.vector.scale(t)),
      tangent: this.normal.flipped,
      normal: this.normal,
    };
  }
}
function Mu(n, t, e, r) {
  const i = { arcLength: 0, segments: [], minSin: 1 },
    a = pe(t.top, t.right, t.left, n),
    h = pe(t.right, t.top, t.bottom, n),
    u = pe(t.bottom, t.left, t.right, n),
    g = pe(t.left, t.bottom, t.top, n);
  let b = new v(n.left + a, n.top),
    x = new v(n.right - h, n.top);
  return (
    Je(i, new Ve(b, x)),
    (b = new v(n.right, n.top + h)),
    (x = new v(n.right, n.bottom - u)),
    h > 0 && Jr(i, b.addX(-h), h, v.down, v.right, e, r),
    Je(i, new Ve(b, x)),
    (b = new v(n.right - u, n.bottom)),
    (x = new v(n.left + g, n.bottom)),
    u > 0 && Jr(i, b.addY(-u), u, v.right, v.up, e, r),
    Je(i, new Ve(b, x)),
    (b = new v(n.left, n.bottom - g)),
    (x = new v(n.left, n.top + a)),
    g > 0 && Jr(i, b.addX(g), g, v.up, v.left, e, r),
    Je(i, new Ve(b, x)),
    (b = new v(n.left + a, n.top)),
    a > 0 && Jr(i, b.addY(a), a, v.left, v.down, e, r),
    i
  );
}
function Je(n, t) {
  n.segments.push(t), (n.arcLength += t.arcLength);
}
function Jr(n, t, e, r, i, a, h) {
  const u = t.add(r.scale(e)),
    g = t.add(i.scale(e));
  a
    ? Je(n, new de(u, u.add(i.scale(h * e)), g.add(r.scale(h * e)), g))
    : Je(n, new pa(t, e, r, i, !1));
}
var Mr =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
let yt = class extends At {
  constructor(t) {
    super(t);
  }
  profile() {
    return Mu(
      this.childrenBBox(),
      this.radius(),
      this.smoothCorners(),
      this.cornerSharpness()
    );
  }
  desiredSize() {
    return { x: this.width.context.getter(), y: this.height.context.getter() };
  }
  offsetComputedLayout(t) {
    return t;
  }
  childrenBBox() {
    return Q.fromSizeCentered(this.computedSize());
  }
  getPath() {
    if (this.requiresProfile()) return this.curveDrawingInfo().path;
    const t = new Path2D(),
      e = this.radius(),
      r = this.smoothCorners(),
      i = this.cornerSharpness(),
      a = Q.fromSizeCentered(this.size());
    return Gi(t, a, e, r, i), t;
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.rippleSize());
  }
  getRipplePath() {
    const t = new Path2D(),
      e = this.rippleSize(),
      r = this.radius().addScalar(e),
      i = this.smoothCorners(),
      a = this.cornerSharpness(),
      h = Q.fromSizeCentered(this.size()).expand(e);
    return Gi(t, h, r, i, a), t;
  }
};
Mr([un("radius")], yt.prototype, "radius", void 0);
Mr([A(!1), P()], yt.prototype, "smoothCorners", void 0);
Mr([A(0.6), P()], yt.prototype, "cornerSharpness", void 0);
Mr([D()], yt.prototype, "profile", null);
yt = Mr([ae("Rect")], yt);
var xe =
  (globalThis && globalThis.__decorate) ||
  function (n, t, e, r) {
    var i = arguments.length,
      a =
        i < 3
          ? t
          : r === null
          ? (r = Object.getOwnPropertyDescriptor(t, e))
          : r,
      h;
    if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
      a = Reflect.decorate(n, t, e, r);
    else
      for (var u = n.length - 1; u >= 0; u--)
        (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
    return i > 3 && a && Object.defineProperty(t, e, a), a;
  };
class Xt extends _ {
  constructor({ children: t, ...e }) {
    super(e), this.scene() || this.scene(new _({})), t && this.scene().add(t);
  }
  getZoom() {
    return 1 / this.scale.x();
  }
  setZoom(t) {
    this.scale(Me(t, (e) => 1 / e));
  }
  getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }
  *tweenZoom(t, e, r, i) {
    const a = this.scale.x();
    yield* Ut(e, (h) => {
      this.zoom(1 / i(a, 1 / Jt(t), r(h)));
    });
  }
  *reset(t, e = Yt) {
    yield* B(
      this.position(Qe, t, e),
      this.zoom(Qe, t, e),
      this.rotation(Qe, t, e)
    );
  }
  *centerOn(t, e, r = Yt, i = v.lerp) {
    const a =
      t instanceof _
        ? t.absolutePosition().transformAsPoint(this.scene().worldToLocal())
        : t;
    yield* this.position(a, e, r, i);
  }
  *followCurve(t, e, r = Yt) {
    yield* Ut(e, (i) => {
      const a = r(i),
        h = t
          .getPointAtPercentage(a)
          .position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  *followCurveReverse(t, e, r = Yt) {
    yield* Ut(e, (i) => {
      const a = 1 - r(i),
        h = t
          .getPointAtPercentage(a)
          .position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  *followCurveWithRotation(t, e, r = Yt) {
    yield* Ut(e, (i) => {
      const a = r(i),
        { position: h, normal: u } = t.getPointAtPercentage(a),
        g = h.transformAsPoint(t.localToWorld()),
        b = u.flipped.perpendicular.degrees;
      this.position(g), this.rotation(b);
    });
  }
  *followCurveWithRotationReverse(t, e, r = Yt) {
    yield* Ut(e, (i) => {
      const a = 1 - r(i),
        { position: h, normal: u } = t.getPointAtPercentage(a),
        g = h.transformAsPoint(t.localToWorld()),
        b = u.flipped.perpendicular.degrees;
      this.position(g), this.rotation(b);
    });
  }
  transformContext(t) {
    const e = this.localToParent().inverse();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent());
    return this.scene().hit(e);
  }
  drawChildren(t) {
    this.scene().drawChildren(t);
  }
  static Stage({ children: t, cameraRef: e, scene: r, ...i }) {
    const a = new Xt({ scene: r, children: t });
    return e == null || e(a), new yt({ clip: !0, ...i, children: [a] });
  }
}
xe([P()], Xt.prototype, "scene", void 0);
xe([Fe(!1), P()], Xt.prototype, "zoom", void 0);
xe([dt()], Xt.prototype, "reset", null);
xe([dt()], Xt.prototype, "centerOn", null);
xe([dt()], Xt.prototype, "followCurve", null);
xe([dt()], Xt.prototype, "followCurveReverse", null);
xe([dt()], Xt.prototype, "followCurveWithRotation", null);
xe([dt()], Xt.prototype, "followCurveWithRotationReverse", null);
var $r =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  Yn;
let me = (Yn = class extends yt {
  constructor(t) {
    super({
      composite: !0,
      fontFamily: "Roboto",
      fontSize: 48,
      lineHeight: "120%",
      textWrap: !1,
      fontStyle: "normal",
      ...t,
    }),
      (this.view2D = this),
      Yn.shadowRoot.append(this.element),
      this.applyFlex();
  }
  dispose() {
    this.removeChildren(), super.dispose();
  }
  render(t) {
    this.computedSize(), this.computedPosition(), super.render(t);
  }
  findKey(t) {
    return Qr().getNode(t) ?? null;
  }
  requestLayoutUpdate() {
    this.updateLayout();
  }
  requestFontUpdate() {
    this.applyFont();
  }
  view() {
    return this;
  }
});
$r([A(br.Paused), P()], me.prototype, "playbackState", void 0);
$r([A(0), P()], me.prototype, "globalTime", void 0);
$r([P()], me.prototype, "assetHash", void 0);
$r(
  [
    ln(() => {
      const n = "motion-canvas-2d-frame";
      let t = document.querySelector(`#${n}`);
      return (
        t ||
          ((t = document.createElement("div")),
          (t.id = n),
          (t.style.position = "absolute"),
          (t.style.pointerEvents = "none"),
          (t.style.top = "0"),
          (t.style.left = "0"),
          (t.style.opacity = "0"),
          (t.style.overflow = "hidden"),
          document.body.prepend(t)),
        t.shadowRoot ?? t.attachShadow({ mode: "open" })
      );
    }),
  ],
  me,
  "shadowRoot",
  void 0
);
me = Yn = $r([ae("View2D")], me);
function $u(n, t, e) {
  const r = { arcLength: 0, segments: [], minSin: 1 };
  if (n.length === 0) return r;
  if (e) {
    const h = n[0].add(n[n.length - 1]).scale(0.5);
    n = [h, ...n, h];
  }
  let i = n[0];
  for (let h = 2; h < n.length; h++) {
    const u = n[h - 2],
      g = n[h - 1],
      b = n[h],
      x = u.sub(g),
      O = b.sub(g),
      N = x.normalized.safe,
      Y = O.normalized.safe,
      st = Math.acos(Lt(-1, 1, N.dot(Y))),
      C = Math.tan(st / 2),
      tt = Math.sin(st / 2),
      vt = Math.min(
        t,
        C * x.magnitude * (h === 2 ? 1 : 0.5),
        C * O.magnitude * (h === n.length - 1 ? 1 : 0.5)
      ),
      it = tt === 0 ? 0 : vt / tt,
      It = C === 0 ? 0 : vt / C,
      Pt = N.add(Y)
        .scale(1 / 2)
        .normalized.safe.scale(it)
        .add(g),
      Ht = N.perpendicular.dot(Y) < 0,
      j = new Ve(i, g.add(N.scale(It))),
      Et = new pa(
        Pt,
        vt,
        N.perpendicular.scale(Ht ? 1 : -1),
        Y.perpendicular.scale(Ht ? -1 : 1),
        Ht
      );
    j.arcLength > 0 && (r.segments.push(j), (r.arcLength += j.arcLength)),
      Et.arcLength > 0 && (r.segments.push(Et), (r.arcLength += Et.arcLength)),
      (r.minSin = Math.min(r.minSin, Math.abs(tt))),
      (i = g.add(Y.scale(It)));
  }
  const a = new Ve(i, n[n.length - 1]);
  return (
    a.arcLength > 0 && (r.segments.push(a), (r.arcLength += a.arcLength)), r
  );
}
function Au(n) {
  return n.reduce((t, e, r) => (r ? t + n[r - 1].sub(e).magnitude : 0), 0);
}
function Bn(n, t, e) {
  const r = n.length;
  let i = 0;
  for (let a = 0; a < t.length; a += 1) {
    const h = n[(e + a) % r],
      u = t[a];
    i += h.sub(u).squaredMagnitude;
  }
  return i;
}
function zu(n, t, e) {
  const r = [];
  if (e === 0) return [...n];
  if (e === 1) return [...t];
  for (let i = 0; i < n.length; i++) {
    const a = n[i],
      h = t[i];
    r.push(v.lerp(a, h, e));
  }
  return r;
}
var Ie =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  en;
let H = (en = class extends At {
  static rotatePoints(t, e, r) {
    if (r) {
      let i = 1 / 0,
        a = 0;
      for (let h = 0; h < t.length; h += 1) {
        const u = Bn(t, e, h);
        u < i && ((i = u), (a = h));
      }
      if (a) {
        const h = t.splice(0, a);
        t.splice(t.length, 0, ...h);
      }
    } else {
      const i = Bn(t, e, 0),
        a = [...t].reverse();
      Bn(a, e, 0) < i && t.reverse();
    }
  }
  static distributePoints(t, e) {
    if (t.length === 0) {
      for (let u = 0; u < e; u++) t.push(v.zero);
      return;
    }
    if (t.length === 1) {
      const u = t[0];
      for (let g = 0; g < e; g++) t.push(u);
      return;
    }
    const r = t.length + e,
      i = Au(t);
    let a = i === 0 ? 0 : e / i,
      h = 0;
    for (; t.length < r; ) {
      const u = r - t.length;
      if (h + 1 >= t.length) {
        (a = i === 0 ? 0 : u / i), (h = 0);
        continue;
      }
      const g = t[h],
        b = t[h + 1],
        x = g.sub(b).magnitude;
      let O = Math.min(Math.round(x * a), u) + 1;
      i === 0 && (O = 2);
      for (let N = 1; N < O; N++) t.splice(++h, 0, v.lerp(g, b, N / O));
      h++;
    }
  }
  *tweenPoints(t, e, r) {
    const i = [...this.parsedPoints()],
      a = this.parsePoints(Jt(t)),
      h = this.closed(),
      u = i.length - a.length;
    en.distributePoints(u < 0 ? i : a, Math.abs(u)),
      en.rotatePoints(a, i, h),
      this.tweenedPoints(i),
      yield* Ut(
        e,
        (g) => {
          const b = r(g);
          this.tweenedPoints(zu(i, a, b));
        },
        () => {
          this.tweenedPoints(null), this.points(t);
        }
      );
  }
  constructor(t) {
    super(t),
      (this.tweenedPoints = ze(null)),
      t.children === void 0 &&
        t.points === void 0 &&
        Tt().warn({
          message: "No points specified for the line",
          remarks: `<p>The line won&#39;t be visible unless you specify at least two points:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span>
  stroke=<span class="hljs-string">&quot;#fff&quot;</span>
  lineWidth={<span class="hljs-number">8</span>}
  points={[
    [<span class="hljs-number">100</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">100</span>],
  ]}
/&gt;</code></pre><p>Alternatively, you can define the points using the children:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>}&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">x</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">y</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
&lt;/<span class="hljs-title class_">Line</span>&gt;</code></pre><p>If you did this intentionally, and want to disable this message, set the
<code>points</code> property to <code>null</code>:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>} points={<span class="hljs-literal">null</span>} /&gt;</code></pre>`,
          inspect: this.key,
        });
  }
  childrenBBox() {
    let t = this.tweenedPoints();
    if (!t) {
      const e = this.points();
      t = e
        ? e.map((r) => new v(Jt(r)))
        : this.children()
            .filter((r) => !(r instanceof $) || r.isLayoutRoot())
            .map((r) => r.position());
    }
    return Q.fromPoints(...t);
  }
  parsedPoints() {
    return this.parsePoints(this.points());
  }
  profile() {
    return $u(
      this.tweenedPoints() ?? this.parsedPoints(),
      this.radius(),
      this.closed()
    );
  }
  lineWidthCoefficient() {
    const t = this.radius(),
      e = this.lineJoin();
    let r = super.lineWidthCoefficient();
    if (t === 0 && e === "miter") {
      const { minSin: i } = this.profile();
      i > 0 && (r = Math.max(r, 0.5 / i));
    }
    return r;
  }
  drawOverlay(t, e) {
    const r = this.childrenBBox().transformCorners(e),
      a = this.computedSize().mul(this.offset()).scale(0.5).transformAsPoint(e);
    (t.fillStyle = "white"), (t.strokeStyle = "black"), (t.lineWidth = 1);
    const h = new Path2D(),
      u = (this.tweenedPoints() ?? this.parsedPoints()).map((g) =>
        g.transformAsPoint(e)
      );
    if (u.length > 0) {
      Lr(h, u[0]);
      for (const g of u)
        Vt(h, g),
          t.beginPath(),
          fa(t, g, 4),
          t.closePath(),
          t.fill(),
          t.stroke();
    }
    (t.strokeStyle = "white"),
      t.stroke(h),
      t.beginPath(),
      ua(t, a),
      t.stroke(),
      t.beginPath(),
      fe(t, r),
      t.closePath(),
      t.stroke();
  }
  parsePoints(t) {
    return t
      ? t.map((e) => new v(Jt(e)))
      : this.children().map((e) => e.position());
  }
});
Ie([A(0), P()], H.prototype, "radius", void 0);
Ie([A(null), P()], H.prototype, "points", void 0);
Ie([dt()], H.prototype, "tweenPoints", null);
Ie([D()], H.prototype, "childrenBBox", null);
Ie([D()], H.prototype, "parsedPoints", null);
Ie([D()], H.prototype, "profile", null);
H = en = Ie([ae("Line")], H);
var Ar =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  rn;
let jt = (rn = class extends Ct {
  constructor({ children: t, ...e }) {
    super(e), t && this.text(t);
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof ct ? t : null;
  }
  draw(t) {
    this.requestFontUpdate(),
      this.applyStyle(t),
      this.applyText(t),
      (t.font = this.styles.font),
      (t.textBaseline = "bottom"),
      "letterSpacing" in t && (t.letterSpacing = `${this.letterSpacing()}px`);
    const e = t.measureText("").fontBoundingBoxAscent,
      r = this.element.getBoundingClientRect(),
      { width: i, height: a } = this.size(),
      h = document.createRange();
    let u = "";
    const g = new Q();
    for (const b of this.element.childNodes) {
      if (!b.textContent) continue;
      h.selectNodeContents(b);
      const x = h.getBoundingClientRect(),
        O = i / -2 + x.left - r.left,
        N = a / -2 + x.top - r.top + e;
      g.y === N
        ? ((g.width += x.width), (u += b.textContent))
        : (this.drawText(t, u, g),
          (g.x = O),
          (g.y = N),
          (g.width = x.width),
          (g.height = x.height),
          (u = b.textContent));
    }
    this.drawText(t, u, g);
  }
  drawText(t, e, r) {
    const i = r.y;
    (e = e.replace(/\s+/g, " ")),
      this.lineWidth() <= 0
        ? t.fillText(e, r.x, i)
        : this.strokeFirst()
        ? (t.strokeText(e, r.x, i), t.fillText(e, r.x, i))
        : (t.fillText(e, r.x, i), t.strokeText(e, r.x, i));
  }
  getCacheBBox() {
    const t = this.computedSize(),
      e = document.createRange();
    e.selectNodeContents(this.element);
    const r = e.getBoundingClientRect(),
      i = this.lineWidth(),
      a = this.lineJoin() === "miter" ? 0.5 * 10 : 0.5;
    return new Q(-t.width / 2, -t.height / 2, r.width, r.height)
      .expand([0, this.fontSize() * 0.5])
      .expand(i * a);
  }
  applyFlex() {
    super.applyFlex(), (this.element.style.display = "inline");
  }
  updateLayout() {
    if (
      (this.applyFont(),
      this.applyFlex(),
      this.justifyContent.isInitial() &&
        (this.element.style.justifyContent =
          this.styles.getPropertyValue("text-align")),
      this.styles.whiteSpace !== "nowrap" && this.styles.whiteSpace !== "pre")
    )
      if (((this.element.innerText = ""), rn.segmenter))
        for (const e of rn.segmenter.segment(this.text()))
          this.element.appendChild(document.createTextNode(e.segment));
      else
        for (const e of this.text().split(""))
          this.element.appendChild(document.createTextNode(e));
    else if (this.styles.whiteSpace === "pre") {
      this.element.innerText = "";
      for (const e of this.text().split(`
`))
        this.element.appendChild(
          document.createTextNode(
            e +
              `
`
          )
        );
    } else this.element.innerText = this.text();
  }
});
Ar([A(""), rs(ra), P()], jt.prototype, "text", void 0);
Ar([D()], jt.prototype, "parentTxt", null);
Ar(
  [
    ln(() => {
      const n = document.createElement("span");
      return me.shadowRoot.append(n), n;
    }),
  ],
  jt,
  "formatter",
  void 0
);
Ar(
  [
    ln(() => {
      try {
        return new Intl.Segmenter(void 0, { granularity: "grapheme" });
      } catch {
        return null;
      }
    }),
  ],
  jt,
  "segmenter",
  void 0
);
jt = rn = Ar([ae("TxtLeaf")], jt);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset",
].forEach((n) => {
  jt.prototype[`get${Le(n)}`] = function () {
    var t;
    return (
      ((t = this.parentTxt()) == null ? void 0 : t[n]()) ??
      this[n].context.getInitial()
    );
  };
});
var zr =
    (globalThis && globalThis.__decorate) ||
    function (n, t, e, r) {
      var i = arguments.length,
        a =
          i < 3
            ? t
            : r === null
            ? (r = Object.getOwnPropertyDescriptor(t, e))
            : r,
        h;
      if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
        a = Reflect.decorate(n, t, e, r);
      else
        for (var u = n.length - 1; u >= 0; u--)
          (h = n[u]) &&
            (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
      return i > 3 && a && Object.defineProperty(t, e, a), a;
    },
  Pe;
let ct = (Pe = class extends Ct {
  static b(t) {
    return new Pe({ ...t, fontWeight: 700 });
  }
  static i(t) {
    return new Pe({ ...t, fontStyle: "italic" });
  }
  getText() {
    return this.innerText();
  }
  setText(t) {
    const e = this.children();
    let r = null;
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      r === null && a instanceof jt ? (r = a) : a.parent(null);
    }
    r === null ? ((r = new jt({ text: t })), r.parent(this)) : r.text(t),
      this.setParsedChildren([r]);
  }
  setChildren(t) {
    this.children.context.raw() !== t &&
      (typeof t == "string" ? this.text(t) : super.setChildren(t));
  }
  *tweenText(t, e, r, i) {
    const a = this.children();
    (a.length !== 1 || !(a[0] instanceof jt)) && this.text.save();
    const h = this.childAs(0),
      u = h.text.context.raw(),
      g = this.size.context.raw();
    h.text(t);
    const b = this.size();
    h.text(u ?? Qe),
      this.height() === 0 && this.height(b.height),
      yield* B(this.size(b, e, r), h.text(t, e, r, i)),
      this.children.context.setter(t),
      this.size(g);
  }
  getLayout() {
    return !0;
  }
  constructor({ children: t, text: e, ...r }) {
    super(r), this.children(e ?? t);
  }
  innerText() {
    const t = this.childrenAs();
    let e = "";
    for (const r of t) e += r.text();
    return e;
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof Pe ? t : null;
  }
  parseChildren(t) {
    const e = [],
      r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof Pe || i instanceof jt
        ? e.push(i)
        : typeof i == "string" && e.push(new jt({ text: i }));
    return e;
  }
  applyFlex() {
    super.applyFlex(),
      (this.element.style.display = this.findAncestor(is(Pe))
        ? "inline"
        : "block");
  }
  draw(t) {
    this.drawChildren(t);
  }
});
zr([A(""), P()], ct.prototype, "text", void 0);
zr([dt()], ct.prototype, "tweenText", null);
zr([D()], ct.prototype, "innerText", null);
zr([D()], ct.prototype, "parentTxt", null);
ct = Pe = zr([ae("Txt")], ct);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset",
].forEach((n) => {
  ct.prototype[`getDefault${Le(n)}`] = function (t) {
    var e;
    return ((e = this.parentTxt()) == null ? void 0 : e[n]()) ?? t;
  };
});
class Ou extends Qc {
  constructor(t) {
    super(t),
      (this.view = null),
      (this.registeredNodes = new Map()),
      (this.nodeCounters = new Map()),
      (this.assetHash = Date.now().toString()),
      this.recreateView();
  }
  getView() {
    return this.view;
  }
  next() {
    var t;
    return (
      (t = this.getView()) == null ||
        t.playbackState(this.playback.state).globalTime(this.playback.time),
      super.next()
    );
  }
  draw(t) {
    t.save(),
      this.renderLifecycle.dispatch([Zt.BeforeRender, t]),
      t.save(),
      this.renderLifecycle.dispatch([Zt.BeginRender, t]),
      this.getView()
        .playbackState(this.playback.state)
        .globalTime(this.playback.time),
      this.getView().render(t),
      this.renderLifecycle.dispatch([Zt.FinishRender, t]),
      t.restore(),
      this.renderLifecycle.dispatch([Zt.AfterRender, t]),
      t.restore();
  }
  reset(t) {
    for (const e of this.registeredNodes.keys())
      try {
        this.registeredNodes.get(e).dispose();
      } catch (r) {
        this.logger.error(r);
      }
    return (
      this.registeredNodes.clear(),
      (this.registeredNodes = new Map()),
      this.nodeCounters.clear(),
      this.recreateView(),
      super.reset(t)
    );
  }
  inspectPosition(t, e) {
    return this.execute(() => {
      var r;
      return (
        ((r = this.getView().hit(new v(t, e))) == null ? void 0 : r.key) ?? null
      );
    });
  }
  validateInspection(t) {
    var e;
    return ((e = this.getNode(t)) == null ? void 0 : e.key) ?? null;
  }
  inspectAttributes(t) {
    const e = this.getNode(t);
    if (!e) return null;
    const r = { stack: e.creationStack, key: e.key };
    for (const { key: i, meta: a, signal: h } of e)
      a.inspectable && (r[i] = h());
    return r;
  }
  drawOverlay(t, e, r) {
    const i = this.getNode(t);
    i &&
      this.execute(() => {
        const a = this.getView().findAll(is(Xt)),
          h = [];
        for (const u of a) {
          const g = u.scene();
          g && (g === i || g.findFirst((b) => b === i)) && h.push(u);
        }
        if (h.length > 0)
          for (const u of h) {
            const g = u.parentToWorld(),
              b = u.localToParent().inverse(),
              x = i.localToWorld();
            i.drawOverlay(r, e.multiply(g).multiply(b).multiply(x));
          }
        else i.drawOverlay(r, e.multiply(i.localToWorld()));
      });
  }
  transformMousePosition(t, e) {
    return new v(t, e).transformAsPoint(
      this.getView().localToParent().inverse()
    );
  }
  registerNode(t, e) {
    var h;
    const r = ((h = t.constructor) == null ? void 0 : h.name) ?? "unknown",
      i = (this.nodeCounters.get(r) ?? 0) + 1;
    this.nodeCounters.set(r, i),
      e &&
        this.registeredNodes.has(e) &&
        (Tt().error({
          message: `Duplicated node key: "${e}".`,
          inspect: e,
          stack: new Error().stack,
        }),
        (e = void 0)),
      e ?? (e = `${this.name}/${r}[${i}]`),
      this.registeredNodes.set(e, t);
    const a = this.registeredNodes;
    return [e, () => a.delete(e)];
  }
  getNode(t) {
    return typeof t != "string" ? null : this.registeredNodes.get(t) ?? null;
  }
  *getDetachedNodes() {
    for (const t of this.registeredNodes.values())
      !t.parent() && t !== this.view && (yield t);
  }
  recreateView() {
    this.execute(() => {
      const t = this.getSize();
      this.view = new me({
        position: t.scale(this.resolutionScale / 2),
        scale: this.resolutionScale,
        assetHash: this.assetHash,
        size: t,
      });
    });
  }
}
function Fu(n) {
  return {
    klass: Ou,
    config: n,
    stack: new Error().stack,
    meta: Kc(),
    plugins: ["@motion-canvas/2d/editor"],
  };
}
const Re = Fu(function* (n) {
  const t = E(),
    e = E(),
    r = E();
  n.add(
    F(ct, {
      ref: t,
      text: "Classification",
      fill: "#ffffff",
      fontSize: 70,
      fontFamily: "Arial",
      x: 0,
      y: -80,
      opacity: 0,
    })
  ),
    n.add(
      F(ct, {
        ref: r,
        text: "of",
        fill: "#ffffff",
        fontSize: 70,
        fontFamily: "Arial",
        x: 0,
        y: 0,
        opacity: 0,
      })
    ),
    n.add(
      F(ct, {
        ref: e,
        text: "Data Structures",
        fill: "#ffffff",
        fontSize: 70,
        fontFamily: "Arial",
        x: 0,
        y: 80,
        opacity: 0,
      })
    ),
    yield* mt("1"),
    yield* B(t().opacity(1, 1), e().opacity(1, 1), r().opacity(1, 1)),
    yield* mt("2"),
    yield* B(t().opacity(0, 1), e().opacity(0, 1), r().opacity(0, 1));
  const i = E(),
    a = E(),
    h = E();
  n.add(
    F(yt, {
      ref: i,
      x: 0,
      y: -300,
      width: 260,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: a,
        text: "Data Structures",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* B(i().opacity(1, 1), a().opacity(1, 1)),
    n.add(
      F(H, {
        ref: h,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, -270],
          [0, -270],
        ],
      })
    ),
    yield* mt("4"),
    yield* B(
      h().points(
        [
          [0, -270],
          [0, -230],
        ],
        0.33
      )
    );
  const u = E(),
    g = E();
  n.add(
    F(H, {
      ref: u,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, -230],
        [0, -230],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: g,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, -230],
          [0, -230],
        ],
      })
    ),
    yield* B(
      u().points(
        [
          [0, -230],
          [-200, -230],
        ],
        0.33
      ),
      g().points(
        [
          [0, -230],
          [200, -230],
        ],
        0.33
      )
    ),
    n.add(
      F(H, {
        ref: u,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [-200, -230],
          [-200, -230],
        ],
      })
    ),
    n.add(
      F(H, {
        ref: g,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [200, -230],
          [200, -230],
        ],
      })
    ),
    yield* B(
      u().points(
        [
          [-200, -230],
          [-200, -190],
        ],
        0.33
      ),
      g().points(
        [
          [200, -230],
          [200, -190],
        ],
        0.33
      )
    );
  const b = E(),
    x = E();
  n.add(
    F(yt, {
      ref: b,
      x: -200,
      y: -160,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: x,
        text: "Linear",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("5"),
    yield* B(b().opacity(1, 1), x().opacity(1, 1));
  const O = E(),
    N = E();
  n.add(
    F(yt, {
      ref: O,
      x: 200,
      y: -160,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: N,
        text: "Non-Linear",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("6"),
    yield* B(O().opacity(1, 1), N().opacity(1, 1)),
    yield* mt("7"),
    yield* B(b().fill("#2f6a55", 1), x().fill("#76f4cd", 1)),
    yield* mt("8");
  const Y = E();
  n.add(
    F(H, {
      ref: Y,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, -130],
        [-200, -130],
      ],
    })
  ),
    yield* B(
      Y().points(
        [
          [-200, -130],
          [-200, -100],
        ],
        0.2
      )
    );
  const st = E();
  n.add(
    F(H, {
      ref: st,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, -100],
        [-200, -100],
      ],
    })
  ),
    yield* B(
      st().points(
        [
          [-200, -100],
          [0, -100],
        ],
        0.2
      )
    );
  const C = E();
  n.add(
    F(H, {
      ref: C,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, -100],
        [0, -100],
      ],
    })
  ),
    yield* B(
      C().points(
        [
          [0, -100],
          [0, -60],
        ],
        0.2
      )
    );
  const tt = E(),
    vt = E();
  n.add(
    F(H, {
      ref: tt,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, -60],
        [0, -60],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: vt,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, -60],
          [0, -60],
        ],
      })
    ),
    yield* B(
      tt().points(
        [
          [0, -60],
          [-200, -60],
        ],
        0.2
      ),
      vt().points(
        [
          [0, -60],
          [200, -60],
        ],
        0.2
      )
    );
  const it = E(),
    It = E();
  n.add(
    F(H, {
      ref: it,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, -60],
        [-200, -60],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: It,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [200, -60],
          [200, -60],
        ],
      })
    ),
    yield* B(
      it().points(
        [
          [-200, -60],
          [-200, -20],
        ],
        0.2
      ),
      It().points(
        [
          [200, -60],
          [200, -20],
        ],
        0.2
      )
    ),
    yield* mt("9");
  const Pt = E(),
    Ht = E();
  n.add(
    F(yt, {
      ref: Pt,
      x: -200,
      y: 10,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: Ht,
        text: "Static",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* B(Pt().opacity(1, 1), Ht().opacity(1, 1));
  const j = E(),
    Et = E();
  n.add(
    F(yt, {
      ref: j,
      x: 200,
      y: 10,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: Et,
        text: "Dynamic",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("10"),
    yield* B(j().opacity(1, 1), Et().opacity(1, 1));
  const lt = E();
  n.add(
    F(H, {
      ref: lt,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, 40],
        [-200, 40],
      ],
    })
  ),
    yield* mt("11"),
    yield* B(
      lt().points(
        [
          [-200, 40],
          [-200, 80],
        ],
        1
      )
    );
  const tr = E(),
    Ee = E();
  n.add(
    F(yt, {
      ref: tr,
      x: -200,
      y: 110,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: Ee,
        text: "Array",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("12"),
    yield* B(tr().opacity(1, 1), Ee().opacity(1, 1));
  const er = E();
  n.add(
    F(H, {
      ref: er,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [200, 40],
        [200, 40],
      ],
    })
  ),
    yield* mt("ppp"),
    yield* B(
      er().points(
        [
          [200, 40],
          [200, 110],
        ],
        0.2
      )
    );
  const rr = E();
  n.add(
    F(H, {
      ref: rr,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [200, 110],
        [200, 110],
      ],
    })
  ),
    yield* B(
      rr().points(
        [
          [200, 110],
          [0, 110],
        ],
        0.2
      )
    );
  const nr = E();
  n.add(
    F(H, {
      ref: nr,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, 110],
        [0, 110],
      ],
    })
  ),
    yield* B(
      nr().points(
        [
          [0, 110],
          [0, 160],
        ],
        0.2
      )
    );
  const sr = E(),
    ir = E();
  n.add(
    F(H, {
      ref: sr,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, 160],
        [0, 160],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: ir,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, 160],
          [0, 160],
        ],
      })
    ),
    yield* B(
      sr().points(
        [
          [0, 160],
          [-200, 160],
        ],
        0.2
      ),
      ir().points(
        [
          [0, 160],
          [200, 160],
        ],
        0.2
      )
    );
  const ar = E(),
    je = E(),
    _e = E();
  n.add(
    F(H, {
      ref: ar,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, 160],
        [-200, 160],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: je,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [200, 160],
          [200, 160],
        ],
      })
    ),
    n.add(
      F(H, {
        ref: _e,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, 160],
          [0, 160],
        ],
      })
    ),
    yield* B(
      ar().points(
        [
          [-200, 160],
          [-200, 200],
        ],
        0.2
      ),
      je().points(
        [
          [200, 160],
          [200, 200],
        ],
        0.2
      ),
      _e().points(
        [
          [0, 160],
          [0, 200],
        ],
        0.2
      )
    );
  const or = E(),
    lr = E();
  n.add(
    F(yt, {
      ref: or,
      x: -200,
      y: 230,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: lr,
        text: "Stack",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("13"),
    yield* B(or().opacity(1, 1), lr().opacity(1, 1));
  const hr = E(),
    cr = E();
  n.add(
    F(yt, {
      ref: hr,
      x: 0,
      y: 230,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: cr,
        text: "Queue",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("14"),
    yield* B(hr().opacity(1, 1), cr().opacity(1, 1));
  const ur = E(),
    ke = E();
  n.add(
    F(yt, {
      ref: ur,
      x: 200,
      y: 230,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: ke,
        text: "Linked List",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("15"),
    yield* B(ur().opacity(1, 1), ke().opacity(1, 1)),
    yield* wr(1),
    yield* mt("16"),
    yield* B(
      Y().opacity(0, 1),
      st().opacity(0, 1),
      tt().opacity(0, 1),
      C().opacity(0, 1),
      lt().opacity(0, 1),
      er().opacity(0, 1),
      vt().opacity(0, 1),
      it().opacity(0, 1),
      It().opacity(0, 1),
      rr().opacity(0, 1),
      nr().opacity(0, 1),
      ar().opacity(0, 1),
      je().opacity(0, 1),
      sr().opacity(0, 1),
      ir().opacity(0, 1),
      _e().opacity(0, 1),
      Pt().opacity(0, 1),
      j().opacity(0, 1),
      tr().opacity(0, 1),
      or().opacity(0, 1),
      hr().opacity(0, 1),
      ur().opacity(0, 1),
      Ht().opacity(0, 1),
      Et().opacity(0, 1),
      Ee().opacity(0, 1),
      lr().opacity(0, 1),
      cr().opacity(0, 1),
      ke().opacity(0, 1),
      b().fill("#000000", 1),
      x().fill("#ffffff", 1),
      O().fill("#2f6a55", 1),
      N().fill("#76f4cd", 1)
    );
  const Or = E();
  n.add(
    F(H, {
      ref: Or,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [200, -130],
        [200, -130],
      ],
    })
  ),
    yield* mt("17"),
    yield* B(
      Or().points(
        [
          [200, -130],
          [200, -100],
        ],
        0.2
      )
    );
  const Fr = E();
  n.add(
    F(H, {
      ref: Fr,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [200, -100],
        [200, -100],
      ],
    })
  ),
    yield* B(
      Fr().points(
        [
          [200, -100],
          [0, -100],
        ],
        0.2
      )
    );
  const Ir = E();
  n.add(
    F(H, {
      ref: Ir,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, -100],
        [0, -100],
      ],
    })
  ),
    yield* B(
      Ir().points(
        [
          [0, -100],
          [0, -60],
        ],
        0.2
      )
    );
  const Er = E(),
    fr = E();
  n.add(
    F(H, {
      ref: Er,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [0, -60],
        [0, -60],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: fr,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [0, -60],
          [0, -60],
        ],
      })
    ),
    yield* B(
      Er().points(
        [
          [0, -60],
          [-200, -60],
        ],
        0.2
      ),
      fr().points(
        [
          [0, -60],
          [200, -60],
        ],
        0.2
      )
    );
  const jr = E(),
    _r = E();
  n.add(
    F(H, {
      ref: jr,
      stroke: "#ffffff",
      lineWidth: 4,
      points: [
        [-200, -60],
        [-200, -60],
      ],
    })
  ),
    n.add(
      F(H, {
        ref: _r,
        stroke: "#ffffff",
        lineWidth: 4,
        points: [
          [200, -60],
          [200, -60],
        ],
      })
    ),
    yield* B(
      jr().points(
        [
          [-200, -60],
          [-200, -20],
        ],
        0.2
      ),
      _r().points(
        [
          [200, -60],
          [200, -20],
        ],
        0.2
      )
    );
  const Dr = E(),
    Nr = E();
  n.add(
    F(yt, {
      ref: Dr,
      x: -200,
      y: 10,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: Nr,
        text: "Tree",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("18"),
    yield* B(Dr().opacity(1, 1), Nr().opacity(1, 1));
  const De = E(),
    Wr = E();
  n.add(
    F(yt, {
      ref: De,
      x: 200,
      y: 10,
      width: 180,
      radius: 20,
      height: 60,
      fill: "#000000",
      lineWidth: 4,
      opacity: 0,
      children: F(ct, {
        ref: Wr,
        text: "Graph",
        fill: "#ffffff",
        fontSize: 28,
        fontFamily: "Arial",
        y: 0,
        opacity: 0,
      }),
    })
  ),
    yield* mt("19"),
    yield* B(De().opacity(1, 1), Wr().opacity(1, 1)),
    yield* wr(1);
});
Re.name = "index";
fu.attach(Re.meta);
Re.onReplaced ?? (Re.onReplaced = new ge(Re.config));
const Iu = { scenes: [Re] };
let os;
os ?? (os = new Sr("\0virtual:settings", !1));
os.loadData({
  version: 1,
  appearance: { color: "rgb(51,166,255)", font: !1, coordinates: !0 },
  defaults: { background: null, size: { x: 1920, y: 1080 } },
});
const Eu = os,
  Xu = Ac(
    "project",
    { core: "3.17.2", two: "3.17.2", ui: "3.17.2", vitePlugin: "3.17.2" },
    [cu()],
    Iu,
    uu,
    Eu
  );
export { Xu as default };
