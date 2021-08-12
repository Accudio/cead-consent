class Cead {
  // set config with defaults
  constructor(config = {}) {
    this.config = {
      default: false,
      cookie: 'cead',
      attribute: 'data-cead',
      srcAttribute: 'data-src',
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
    const cookie = this.getCookie(this.config.name)

    // if cookie is not set, show consent manager
    if (!cookie) {
      this.el.setattr('data-show', 'true')
    }

    // when readyState is interactive, the DOM has finished loading but resources haven't necessarily loaded
    // similar to DOMContentLoaded, but doesn't wait for syncronous scripts
    // on interactive, run ready function
    document.onreadystatechange = () => {
      if (document.readyState === 'interactive') {
        this.ready()
      }
    }

    // on click of accept button, close consent manager, return focus if applicable and activate tracking
    const acceptBtn = document.querySelector('.cead__btn--accept')
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      this.el.removeattr('data-show')
      if (this.focus) this.focus.focus()
      this.activate()
    })

    // on click of decline button, close consent manager, return focus if applicable and remove cookies
    const declineBtn = document.querySelector('.cead__btn--decline')
    if (declineBtn) declineBtn.addEventListener('click', () => {
      this.el.removeattr('data-show')
      if (this.focus) this.focus.focus()
      this.deactivate()
    })

    // add event listener to open consent manager on click of #cead links
    this.links()
  }

  /**
   * ready
   *
   * when ready, check cookie and activate tracking if applicable
   */
  ready() {
    const cookie = this.getCookie(this.config.name)

    const state = this.config.default
      ? cookie !== 'false'
      : cookie === 'true'

    if (state) {
      this.activate()
    }
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
    this.setCookie(true)

    const scripts = document.querySelectorAll(`[${this.config.attr}]`);

    for (let script of scripts) {
      // inline scripts don't have `src` or `data-src` attributes
      // instead we copy the script, replace the text/plain type attribute
      // and then replace the original - triggering it to run
      if (!script.hasattr('src') && !script.hasattr(this.config.srcAttr)) {
        const copy = script.cloneNode(true);
        copy.setattr('type', 'text/javascript');
        script.after(copy);
        script.remove();

      // external scripts
      // set src attribute to what is specified in data-src
      } else {
        script.setattr('src', script.getattr(this.config.srcAttr));
      }
    }
  }

  /**
   * deactivate
   *
   * sets cookie to false and removes cookies listed in config.cookies
   */
  deactivate() {
    this.setCookie(false)

    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      // check if this is a cookie that should be removed
      const name = cookie.match('\\s*(.*?)\\s*=.*')?.[1] || 'none';

      if (this.config.cookies.includes(name)) {
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
    document.cookie = `${this.config.name}=${status}; path=/; domain=.${document.domain}; Expires=${expiry.toUTCString()};`;
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

        this.el.setattr('data-show', 'true')
        this.el.focus()
      })
    })
  }
}

export default Cead
