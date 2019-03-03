import axios from 'axios'

class WebHDFS {
  constructor (config) {
    if (!config) {
      throw new Error('WebHDFS构造参数不可为空。')
    }
    if (!config.host) {
      throw new Error('WebHDFS的主机地址不可为空。')
    }
    if (!config.port) {
      throw new Error('WebHDFS的端口不可为空。')
    }
    if (!config.user) {
      throw new Error('WebHDFS的用户不可为空。')
    }
    this.config = config
    this.url = 'http://' + this.config.host + ':' + this.config.port + '/webhdfs/v1'
    this.initAjax()
  }

  initAjax () {
    this.ajax = axios
    this.ajax.interceptors.response.use(
      response => {
        this.emitEvent('success', response)
        return response
      },
      error => {
        this.emitEvent('error', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 创建目录
   * @param path
   * @param option: {
   *   permission: OCTAL
   * }
   */
  mkdirs (path, option) {
    let url = this.url + path + '?op=MKDIRS'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 创建文件
   * @param path
   * @param file
   * @param option: {
   *   overwrite: BOOLEAN
   *   blocksize: LONG
   *   replication: SHORT
   *   permission: OCTAL
   *   buffersize: INT
   * }
   * @returns {*}
   */
  create (path, file, option) {
    let url = this.url + path + '?op=CREATE'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
      .then(() => {
        // 307 TEMPORARY_REDIRECT
        let data = {}
        if (file) {
          let data = new FormData()
          data.append('file', file)
        }
        return this.request(url, 'PUT', data)
      })
  }

  /**
   * 附加到文件
   * @param path
   * @param file
   * @param option: {
   *   buffersize: INT
   * }
   * @returns {*}
   */
  append (path, file, option) {
    let url = this.url + path + '?op=APPEND'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
      .then(() => {
        // 307 TEMPORARY_REDIRECT
        let data = {}
        if (file) {
          let data = new FormData()
          data.append('file', file)
        }
        return this.request(url, 'PUT', data)
      })
  }

  /**
   * 合并文件
   * @param path
   * @param sourcePath
   */
  concat (path, sourcePath) {
    let url = this.url + path + '?op=CONCAT&sources=' + sourcePath
    return this.request(url, 'POST')
  }

  /**
   * 打开并阅读文件
   * @param path
   * @param option: {
   *   offset: LONG
   *   length: LONG
   *   buffsize: INT
   * }
   */
  open (path, option) {
    let url = this.url + path + '?op=OPEN'
    url += this.formatOption(option)
    return this.request(url, 'GET')
  }

  /**
   * 创建符号链接
   * @param path
   * @param destination
   * @param option: {
   *   createParent: BOOLEAN
   * }
   * @returns {*}
   */
  createSymLink (path, destination, option) {
    let url = this.url + path + '?op=CREATESYMLINK&destination=' + destination
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 重命名文件/文件夹
   * @param path
   * @param destination
   * @returns {*}
   */
  rename (path, destination) {
    let url = this.url + path + '?op=RENAME&destination=' + destination
    return this.request(url, 'PUT')
  }

  /**
   * 删除文件/文件夹
   * @param path
   * @param option: {
   *   recursive: BOOLEAN
   * }
   */
  delete (path, option) {
    let url = this.url + path + '?op=DELETE'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 截断文件
   * @param path
   * @param length
   */
  truncate (path, length) {
    let url = this.url + path + '?op=TRUNCATE&newlength=' + length
    return this.request(url, 'POST')
  }

  /**
   * 文件/文件夹状态
   * @param path
   * @returns {*}
   */
  getFileStatus (path) {
    let url = this.url + path + '?op=GETFILESTATUS'
    return this.request(url, 'GET')
  }

  /**
   * 列出一个目录
   * @param path
   * @returns {*}
   */
  listStatus (path) {
    let url = this.url + path + '?op=LISTSTATUS'
    return this.request(url, 'GET')
  }

  /**
   * 获取目录的内容摘要
   * @param path
   */
  getContentSummary (path) {
    let url = this.url + path + '?op=GETCONTENTSUMMARY'
    return this.request(url, 'GET')
  }

  /**
   * 获取文件校验和
   * @param path
   */
  getFileCheckSum (path) {
    let url = this.url + path + '?op=GETFILECHECKSUM'
    return this.request(url, 'GET')
  }

  /**
   * 获取主目录
   * @param path
   * @returns {*}
   */
  getHomeDirectory (path) {
    let url = this.url + path + '?op=GETHOMEDIRECTORY'
    return this.request(url, 'GET')
  }

  /**
   *
   * @param path
   * @param option: {
   *   permission: OCTAL
   * }
   */
  setPermission (path, option) {
    let url = this.url + path + '?op=SETPERMISSION'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 设置所有者
   * @param path
   * @param option: {
   *   owner: USER
   *   group: GROUP
   * }
   * @returns {*}
   */
  setOwner (path, option) {
    let url = this.url + path + '?op=SETOWNER'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 设置复制因子
   * @param path
   * @param option: {
   *   replication: SHORT
   * }
   * @returns {*}
   */
  setReplication (path, option) {
    let url = this.url + path + '?op=SETREPLICATION'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 设置访问或修改时间
   * @param path
   * @param option: {
   *   modificationtime: TIME
   *   accesstime: TIME
   * }
   */
  setTimes (path, option) {
    let url = this.url + path + '?op=SETTIMES'
    url += this.formatOption(option)
    return this.request(url, 'PUT')
  }

  /**
   * 修改ACL条目
   * @param path
   * @param aclspec
   * @returns {*}
   */
  modifyAclEntries (path, aclspec) {
    let url = this.url + path + '?op=MODIFYACLENTRIES&aclspec=' + aclspec
    return this.request(url, 'PUT')
  }

  /**
   * 删除ACL条目
   * @param path
   * @param aclspec
   * @returns {*}
   */
  removeAclEntries (path, aclspec) {
    let url = this.url + path + '?op=REMOVEACLENTRIES&aclspec=' + aclspec
    return this.request(url, 'PUT')
  }

  /**
   * 删除默认ACL
   * @param path
   * @returns {*}
   */
  removeDefaultAcl (path) {
    let url = this.url + path + '?op=REMOVEDEFAULTACL'
    return this.request(url, 'PUT')
  }

  /**
   * 删除ACL
   * @param path
   * @returns {*}
   */
  removeAcl (path) {
    let url = this.url + path + '?op=REMOVEACL'
    return this.request(url, 'PUT')
  }

  /**
   * 设置ACL
   * @param path
   * @returns {*}
   */
  setAcl (path, aclspec) {
    let url = this.url + path + '?op=REMOVEACL&aclspec=' + aclspec
    return this.request(url, 'PUT')
  }

  /**
   * 获取ACL状态
   * @param path
   * @returns {*}
   */
  getAclStatus (path) {
    let url = this.url + path + '?op=GETACLSTATUS'
    return this.request(url, 'GET')
  }

  /**
   * 检查访问
   * @param path
   * @param fsaction
   * @returns {*}
   */
  checkAccess (path, fsaction) {
    let url = this.url + path + '?op=CHECKACCESS&fsaction=' + fsaction
    return this.request(url, 'GET')
  }

  // 存储策略操作

  formatOption (option) {
    let param = ''
    if (option) {
      for (let key in option) {
        param = param + '&' + key + '=' + option[key]
      }
    }
    return param
  }

  request (url, method, data) {
    return this.ajax({
      method: method,
      url: url,
      data: data
    })
  }

  emitEvent (eventName, args) {
    if (!this.config || !this.config.events) {
      return
    }
    let event = this.config.events[eventName]
    if (event && typeof event === 'function') {
      event.apply(this, args)
    }
  }
}

export default WebHDFS
