import PromisePlaceholder from "promise-placeholder"
const PromisePlaceholder_default = PromisePlaceholder.__default || PromisePlaceholder;
import fetch from "node-fetch"

export function getReviver(reviverOrig) {
    function reviver(k, v) {
        let url;
        if (typeof v === 'string' && (url = criteria.satisfies(v))) {
            return actions.fetch(url, reviver);
        } else if (reviverOrig) {
            v = reviverOrig(v);
        }
        return v;
    }
    reviver.collect = actions.collect;
    return reviver;
}

export const criteria = {
    satisfies: function (v) {
        const match = v.match(/^\.\.\.(https?:\/\/.*)/);
        if (match && match[1]) {
            return match[1];
        }
    }
}

export const actions = {
    fetch: function (url, reviver) {
        return async function() {
            const r = await fetch(url);
            const r_1 = await r.text();
            const r_2 = json_settings.parse(r_1, reviver);
            return r_2;
        }
    },
    collect: async function collect (obj) {
        const pp = (new PromisePlaceholder_default()).collect(obj);
        if(pp.size()) {
            pp.setReviver('ignore')
            await pp.exec();
            const newObj = pp.getResults();
            await this.collect(newObj);
            const reviver = actions.reviver;
            pp.getRefs().forEach(({ obj: ref, k }, i) => {
                reviver(ref, k, newObj[i]);
            });
        }
        return obj;
    },
    reviver: function(original_object, key, value) {
        if(Array.isArray(original_object)) {
            original_object.splice(key, 1, ...value);
        } else {
            delete original_object[key];
            Object.entries(value).forEach(([k, v]) => {
                original_object[k] = v;
            });
        }
    }
}

export const json_settings = {
    parse: JSON.parse,
}

const reviver = getReviver();
export default reviver;
