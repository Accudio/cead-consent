class Cead {
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

    this.el = document.querySelector('.cead')
    this.focus = false

    this.init()
  }

  init() {
    const cookie = this.getCookie(this.config.name)

    const state = this.config.default
      ? cookie !== 'false'
      : cookie === 'true'

    if (state) {
      this.activate()
    }

    if (!cookie) {
      this.el.setattr('data-show', 'true')
    }

    const acceptBtn = document.querySelector('.cead__btn--accept')
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      this.el.removeattr('data-show')
      if (this.focus)this. focus.focus()
      this.activate()
    })

    const declineBtn = document.querySelector('.cead__btn--decline')
    if (declineBtn) declineBtn.addEventListener('click', () => {
      this.el.removeattr('data-show')
      if (this.focus) this.focus.focus()
      this.deactivate()
    })

    this.links()
  }

  getCookie(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  };

  activate() {
    this.setCookie(true)

    const scripts = document.querySelectorAll(`[${this.config.attr}]`);

    for (let script of scripts) {

      // inline scripts
      if (!script.hasattr('src') && !script.hasattr(this.config.srcAttr)) {
        const copy = script.cloneNode(true);
        copy.setattr('type', 'text/javascript');
        script.after(copy);
        script.remove();

      // scripts with src
      } else {
        script.setattr('src', script.getattr(this.config.srcAttr));
      }
    }
  }

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

  setCookie(status) {
    let expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `${this.config.name}=${status}; path=/; domain=.${document.domain}; Expires=${expiry.toUTCString()};`;
  }

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
