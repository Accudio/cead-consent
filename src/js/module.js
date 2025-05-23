class Cead {
  // set config with defaults
  constructor(config = {}) {
    this.config = {
      default: false,
      cookie: 'cead',
      attr: 'data-cead',
      srcAttr: 'data-src',
      link: '#cead',
      cookies: [],

      // override defaults
      ...config
    }

    // consent element and focus
    this.el = document.querySelector('.cead')
    this.focus = false

    // initialise
    this.init()
  }

  /**
   * init
   *
   * initialise consent manager, runs immediately on loading
   */
  init() {
    // get current cookie state
    const cookie = this.getCookie(this.config.cookie)

    // if cookie is not set, show consent manager
    if (!cookie) {
      this.el.setAttribute('data-show', 'true')
    }

    // trigger ready
    this.ready()

    // when readyState is interactive, the DOM has finished loading but resources haven't necessarily loaded
    // similar to DOMContentLoaded, but doesn't wait for syncronous scripts
    // on interactive, run ready function
    document.onreadystatechange = () => {
      if (document.readyState === 'interactive') {
        this.ready()
      }
    }

    // on click of accept button, trigger accept function
    const acceptBtn = document.querySelector('.cead__btn--accept')
    if (acceptBtn) acceptBtn.addEventListener('click', () => this.accept())

    // on click of decline button, trigger accept function
    const declineBtn = document.querySelector('.cead__btn--decline')
    if (declineBtn) declineBtn.addEventListener('click', () => this.decline())

    // add event listener to open consent manager on click of #cead links
    this.links()
  }

  /**
   * ready
   *
   * when ready, check cookie, activate tracking if applicable and fire event
   */
  ready() {
    const cookie = this.getCookie(this.config.cookie)

    const state = this.config.default
      ? cookie !== 'false'
      : cookie === 'true'

    if (state) {
      this.activate()
    }

    // fire event
    window.dispatchEvent(new CustomEvent('cead:ready', {
      detail: { status: state }
    }))
  }

  /**
   * accept
   *
   * close consent manager,
   * return focus if applicable,
   * set cookie,
   * activate tracking
   * and fire event
   */
  accept() {
    this.el.removeAttribute('data-show')

    if (this.focus) this.focus.focus()

    this.setCookie(true)
    this.activate()

    // fire event
    window.dispatchEvent(new CustomEvent('cead:change', {
      detail: { status: true }
    }))
  }

  /**
   * decline
   *
   * close consent manager,
   * return focus if applicable,
   * set cookie,
   * remove cookies
   * and fire event
   */
  decline() {
    this.el.removeAttribute('data-show')

    if (this.focus) this.focus.focus()

    this.setCookie(false)
    this.deactivate()

    // fire event
    window.dispatchEvent(new CustomEvent('cead:change', {
      detail: { status: false }
    }))
  }

  /**
   * getCookie
   *
   * uses regex to get the value of a cookie given it's name
   *
   * @param   {string}  name  cookie name
   * @returns {string}  cookie value
   */
  getCookie(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  }

  /**
   * activate
   *
   * sets cookie to true and replaces attributes on tracking scripts - activating them
   */
  activate() {
    const scripts = document.querySelectorAll(`[${this.config.attr}]`);

    for (let script of scripts) {
      // inline scripts don't have `src` or `data-src` attributes
      // instead we copy the script, replace the text/plain type attribute
      // and then replace the original - triggering it to run
      if (!script.hasAttribute('src') && !script.hasAttribute(this.config.srcAttr)) {
        const copy = script.cloneNode(true);
        copy.setAttribute('type', 'text/javascript');
        script.after(copy);
        script.remove();

      // external scripts
      // set src attribute to what is specified in data-src
      } else {
        script.setAttribute('src', script.getAttribute(this.config.srcAttr));
      }
    }
  }

  /**
   * deactivate
   *
   * sets cookie to false and removes cookies listed in config.cookies
   */
  deactivate() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      // check if this is a cookie that should be removed
      const name = cookie.match('\\s*(.*?)\\s*=.*')?.[1] || 'none';
      // Check cookie name against config.cookies array which may contain regex strings
      const matches = this.config.cookies.some(pattern => {
        return (typeof pattern === 'string' && pattern === name) 
          || (typeof pattern === 'object' && pattern instanceof RegExp && pattern.test(name));
      });

      if (matches) {
        // some scripts use domain.com, some use .domain.com
        document.cookie = name + '=; path=/; domain='+ document.domain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = name + '=; path=/; domain=.'+ document.domain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    }
  }

  /**
   * setCookie
   *
   * sets our cookie for the consent status
   *
   * @param {boolean} status whether tracking should be enabled
   */
  setCookie(status) {
    let expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `${this.config.cookie}=${status}; path=/; domain=.${document.domain}; Expires=${expiry.toUTCString()}; SameSite=Lax`;
  }

  /**
   * links
   *
   * on click of #${config.link} (default #cead), open the consent manager
   */
  links() {
    const links = document.querySelectorAll(`a[href="${this.config.link}"]`)

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        this.focus = document.activeel

        this.el.setAttribute('data-show', 'true')
        this.el.focus()
      })
    })
  }
}

export default Cead
