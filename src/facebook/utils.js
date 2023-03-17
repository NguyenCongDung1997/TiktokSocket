class Stack {
    constructor() {
        this.stack = [];
        this.pairs = {
            "{": "}",
            "[": "]"
        }
        this.startIndex = null;
        this.endIndex = null;
    }
    push(char, index) {
        if (this.pairs[char]) {
            if (this.startIndex == null) {
                this.startIndex = index;
            }
            this.stack.push(char);
            return {
                done: false
            };
        }
        const firstStackPair = this.peek();

        if (firstStackPair && this.pairs[firstStackPair] == char) {
            this.stack.pop();
            if (this.isEmpty()) {
                this.endIndex = index;
                return {
                    done: true,
                    start: this.startIndex,
                    end: this.endIndex,
                }
            }
        }

        return {
            done: false
        };

    }
    peek() {
        return this.isEmpty() ? null : this.stack[this.stack.length - 1];
    }
    isEmpty() {
        return this.stack.length === 0;
    }
}

export const GetModule = (html, keyToFind) => {
    const matchedList = [];
    let index = 0;
    const getMatchKeyStack = (index) => {
        var str = "";
        var flag = false;
        var stack = new Stack();
        for (var i = index; i < html.length; i++) {
            var char = html[i];
            if (flag) {
                const st = stack.push(char, i);
                if (st.done) return {
                    start: st.start,
                    end: st.end,
                    done: false
                };
            } else {
                if (keyToFind[str.length] == char) {
                    str += char;
                    if (str.length === keyToFind.length) {
                        flag = true;
                    }
                } else {
                    str = ""
                }
            }
        }
        return {
            done: true
        }

    }
    while (true) {
        const match = getMatchKeyStack(index);
        if (match.done) break;

        matchedList.push({
            start: match.start,
            end: match.end
        })
        index = match.end + 1;

    }
    return matchedList.map((t) => html.slice(t.start, t.end + 1));
}

export const calcJazoest = (dstg, config) => {
    let jazoest = 0;
    for (let i = 0; i < dstg.length; i++) {
        jazoest += dstg.charCodeAt(i);
    }
    if (config.version == 2 && config.should_randomize) {
        return jazoest.toString();
    }
    return "2" + jazoest;
}

const binaryToDecimal = (data) => {
    var ret = "";
    while (data !== "0") {
        var end = 0;
        var fullName = "";
        var i = 0;
        for (; i < data.length; i++) {
            end = 2 * end + parseInt(data[i], 10);
            if (end >= 10) {
                fullName += "1";
                end -= 10;
            } else {
                fullName += "0";
            }
        }
        ret = end.toString() + ret;
        data = fullName.slice(fullName.indexOf("1"));
    }
    return ret;
}

export const generateOfflineThreadingID = () => {
    var ret = Date.now();
    var value = Math.floor(Math.random() * 4294967295);
    var str = ("0000000000000000000000" + value.toString(2)).slice(-22);
    var msgs = ret.toString(2) + str;
    return binaryToDecimal(msgs);
}

export const makeParsable = (e) => {
    return e.replace(/for\s*\(\s*;\s*;\s*\)\s*;\s*/, "");
}
