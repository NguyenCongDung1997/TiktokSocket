const H = {
    Session: null,
};

function v(e) {
    return null == F && (F = j(e)), F;
}

const B = 4294967296;
function m() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        t = "function" == typeof Uint32Array ? new Uint32Array(1) : null,
        r = crypto || msCrypto;
    if (null != t)
        try {
            var n = null == r ? void 0 : r.getRandomValues;
            if ("function" == typeof n) {
                var a = n.bind(r);
                return function () {
                    try {
                        a(t);
                    } catch (t) {
                        return v(e)();
                    }
                    return t[0] / B;
                };
            }
        } catch (e) { }
    return v(e);
}

var F;
const j = new (function () {
    return function () {
        for (
            var e = 0,
            t = 0,
            r = 0,
            n = 1,
            a = arguments.length,
            o = new Array(a),
            i = 0;
            i < a;
            i++
        )
            o[i] = arguments[i];
        var s = o.length > 0 ? o : [new Date()],
            c = new g();
        (e = c(" ")), (t = c(" ")), (r = c(" "));
        for (var u = 0; u < s.length; u++)
            (e -= c(s[u])) < 0 && (e += 1),
                (t -= c(s[u])) < 0 && (t += 1),
                (r -= c(s[u])) < 0 && (r += 1);
        c = null;
        var l = function () {
            var a = 2091639 * e + 2.3283064365386963e-10 * n;
            return (e = t), (t = r), (r = a - (n = 0 | a));
        };
        return (l.version = "Alea 0.9"), (l.args = s), l;
    };
})();

const G = Math.pow(36, 6);

class baseSession {
    constructor() {
        var t,
            r = Date.now();
        (this.sessionStorage = {}), (t = null != (t = t) ? t : r + 35e3);
        var n = this.r(r);
        (n && n.expiryTime >= t) ||
            t <= r ||
            (null != r &&
                ((n = null == n ? this.o() : n.id),
                    (H.Session = {
                        id: n,
                        expiryTime: t,
                    })),
                (this.p = null));
    }

    reset() {
        var e,
            t = Date.now();
        e = null != (e = e) ? e : t + 35e3;
        var r = this.r(t);
        (r && r.expiryTime >= e) ||
            e <= t ||
            (null != t &&
                ((r = null == r ? this.o() : r.id),
                    (H.Session = {
                        id: r,
                        expiryTime: e,
                    })));
    }

    setServerNonce(e) {
        this.ServerNonce = e;
    }

    getId() {
        this.reset();
        var e,
            t,
            r = this.q();
        return (
            (e = null != (e = this.s()) ? e : "") +
            ":" +
            (t = null != (t = this.t()) ? t : "") +
            ":" +
            r
        );
    }

    getPageId_DO_NOT_USE() {
        return this.q();
    }

    k(e) {
        return null == e || !1 === Number.isFinite(e) || e <= 0 ? null : e;
    }

    l(e) {
        if (null == e) return null;
        var t = parseInt(e, 10);
        return "" + t !== "".concat(e) ? null : this.k(t);
    }

    m(e) {
        return null == e || 6 !== e.length
            ? null
            : Number.isInteger(e)
                ? 1
                : !1 === /^[a-z0-9]+$/.test(e)
                    ? null
                    : e;
    }

    n(e) {
        if (null == e) return null;
        var t = e.id,
            r = e.expiryTime;
        return (
            (r = this.l(r)),
            (t = this.m(t)),
            null == r || null == t
                ? null
                : {
                    expiryTime: r,
                    id: t,
                }
        );
    }

    o() {
        var e = Math.floor(m(this.ServerNonce)() * G);
        return (e = e.toString(36)), "0".repeat(6 - e.length) + e;
    }

    q() {
        return null == this.p && (this.p = this.o()), this.p;
    }

    r(e) {
        void 0 === e && (e = Date.now());
        var t = this.n(H.Session);
        return t && e < t.expiryTime ? t : null;
    }

    s() {
        var e;
        return null == (e = this.r()) ? void 0 : e.id;
    }
    t() {
        var e = this.m(this.sessionStorage.TabId);
        if (null == e) {
            var t = this.o();
            return (this.sessionStorage.TabId = t), t;
        }
        return e;
    }
}
export default new baseSession();