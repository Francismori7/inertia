import { h } from 'vue'
import { hrefToUrl, Inertia, mergeDataIntoQueryString, shouldIntercept } from '@inertiajs/inertia'

export default {
  props: {
    as: {
      type: String,
      default: 'a',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    href: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'get',
    },
    replace: {
      type: Boolean,
      default: false,
    },
    preserveScroll: {
      type: Boolean,
      default: false,
    },
    preserveState: {
      type: Boolean,
      default: null,
    },
    only: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots, attrs }) {
    return props => {
      const as = props.as.toLowerCase()
      const method = props.method.toLowerCase()
      const [url, data] = mergeDataIntoQueryString(method, hrefToUrl(props.href), props.data)

      return h(props.as, {
        ...attrs,
        ...as === 'a' ? { href: url.href } : {},
        onClick: (event) => {
          if (shouldIntercept(event)) {
            event.preventDefault()

            Inertia.visit(url.href, {
              data: data,
              method: method,
              replace: props.replace,
              preserveScroll: props.preserveScroll,
              preserveState: props.preserveState ?? (method !== 'get'),
              only: props.only,
              headers: props.headers,
              onCancelToken: attrs.onCancelToken || (() => ({})),
              onStart: attrs.onStart || (() => ({})),
              onProgress: attrs.onProgress || (() => ({})),
              onFinish: attrs.onFinish || (() => ({})),
              onCancel: attrs.onCancel || (() => ({})),
              onSuccess: attrs.onSuccess || (() => ({})),
            })
          }
        },
      }, slots.default())
    }
  },
}
