(function(jq) {
  const fbMessageWrapperRight = jq('.fbDockWrapperRight'),
        fbChatSidebar = jq('.fbChatSidebar'),
        leftCol = jq('#leftCol'), // 左側 panel
        rightCol = jq('#rightCol'), // 右側 panel
        pageLetBlueBar = jq('#pagelet_bluebar'), // 置頂選項
        feedxSproutsContainer = jq('#feedx_sprouts_container form'), // 建立貼文區下方
        streamPagelet = jq('#stream_pagelet'), //塗鴉牆內文區塊下方純動態的地方

        contentCol = jq('#contentCol'), // 中間加右邊組合而成的區塊
        contentArea = jq('#contentArea'), // 中間塗鴉牆區整塊

        topnewsMainStream = jq('#topnews_main_stream_408239535924329'), //文章區

        searchBarClickRef = jq('#searchBarClickRef') // 搜尋列
        w = jq(window)

  let rightColIsRight = false,
      leftColIsRight = false,
      topIsHidden = false,
      fbMessageIsHidden = true,
      fbActiveIsHidden = true,
      fbSearchIsHidden = true

  document.body.style.overflowX = 'hidden'

  // Search-Bar
  let searchBarCloneContainer, inputtext
  if (searchBarClickRef.length) {
    searchBarCloneContainer = jq('<div></div>')
    searchBarCloneContainer[0].id = 'search-bar-clone-container'
    searchBarCloneContainer[0].style.position = 'absolute'
    searchBarCloneContainer[0].style.display = 'none'
    searchBarCloneContainer[0].style.top = '0px'
    searchBarCloneContainer[0].style.width = '100%'
    searchBarCloneContainer[0].style.height = '100%'
    searchBarCloneContainer[0].style.zIndex = '997'
    const searchBarCloneMask = jq('<div></div>')
    searchBarCloneMask[0].id = 'search-bar-clone-mask'
    searchBarCloneMask[0].style.position = 'absolute'
    searchBarCloneMask[0].style.backgroundColor = 'rgba(0, 0, 0, .6)'
    searchBarCloneMask[0].style.top = '0px'
    searchBarCloneMask[0].style.width = '100%'
    searchBarCloneMask[0].style.height = '100%'
    searchBarCloneMask[0].style.zIndex = '998'
    const searchBarClone = searchBarClickRef.clone(true)
    searchBarClone[0].id = 'search-bar-clone'
    searchBarClone[0].style.position = 'absolute'
    searchBarClone[0].style.top = '50%'
    searchBarClone[0].style.transform = 'translate(50%, 0)'
    searchBarClone[0].style.zIndex = '999'
    searchBarCloneContainer.append(searchBarCloneMask[0])
    searchBarCloneContainer.append(searchBarClone[0])
    document.body.appendChild(searchBarCloneContainer[0])
    const searchButton = jq('#search-bar-clone button')
    searchButton[0].style.display = 'none'
    const uiTypeahead = jq('#search-bar-clone .uiTypeahead')
    uiTypeahead[0].style.width = '800px'
    uiTypeahead[0].style.height = '50px'
    uiTypeahead[0].style.borderRadius = '5px'
    const uiSearchInput = jq('#search-bar-clone .uiSearchInput')
    uiSearchInput[0].style.borderRadius = '5px'
    inputtext = jq('#search-bar-clone .inputtext')
    inputtext[0].style.height = '40px'
    inputtext[0].style.width = '800px'
    inputtext[0].style.borderRadius = '5px'
    inputtext[0].style.fontSize = '30px'
  }

  // 功能按鈕轉換
  const keyFeaturesContainer = jq('<div id="key-features-container"></div>')
  keyFeaturesContainer.css({
    width: '100%',
    justifyContent: 'center',
    position: 'fixed',
    display: 'flex',
    top: '0'
  })

  // L
  const keyLIntoButton = jq('<div id="key-l-into-button" class="btn btn-success">切換左側面板</div>')
  keyLIntoButton.css({})
  keyLIntoButton.on('click', runKeyL)

  // R
  const keyRIntoButton = jq('<div id="key-r-into-button" class="btn btn-success">切換右側面板</div>')
  keyRIntoButton.css({})
  keyRIntoButton.on('click', runKeyR)

  // I
  const keyIIntoButton = jq('<div id="key-i-into-button" class="btn btn-success">建立貼文面板縮放</div>')
  keyIIntoButton.css({})
  keyIIntoButton.on('click', runKeyI)

  // C
  const keyCIntoButton = jq('<div id="key-c-into-button" class="btn btn-success">隱藏聊天室</div>')
  keyCIntoButton.css({})
  keyCIntoButton.on('click', runKeyC)

  keyFeaturesContainer.append(keyLIntoButton)
                        .append(keyRIntoButton)
                        .append(keyIIntoButton)
                        .append(keyCIntoButton)

  document.body.appendChild(keyFeaturesContainer[0])

  // delegate 綁定所有 Click
  const bindingCache = []
  topnewsMainStream.on('click', function(ev) {
    console.log(bindingCache)
    if (ev.target.className === 'timestampContent' && bindingCache.indexOf(ev.target.parentNode.parentNode) < 0) {
      ev.target.parentNode.parentNode.addEventListener('click', function(ev) {
        console.log('run')
        ev.preventDefault()
      })
      bindingCache.push(ev.target.parentNode.parentNode)
    }
  })

  // default setting
  if (window.localStorage.getItem('facebook-refined-rightCol') === 'true') {
    rightCol.fadeOut(function() {
      //FIXME 修正右方區塊消失後，導致中間整體偏移至右邊
      contentArea.css('cssText', 'width: 100% !important; left: 0px;')
      if (leftColIsRight) {
        contentCol.css('cssText', 'width: 100% !important; margin-left: 0px !important;')
      }
    })
    rightColIsRight = true
  }
  if (window.localStorage.getItem('facebook-refined-leftCol') === 'true') {
    leftCol.fadeOut(function() {
      if (rightColIsRight) {
        contentCol.css('cssText', 'width: 100% !important; margin-left: 0px !important;')
      }
    })
    leftColIsRight = true
  }

  // panel 滑動控制
  const keyL = 76,
        keyR = 82,
        keyT = 84,
        keyC = 67,
        keyI = 73,
        keyS = 83,
        keyH = 72,
        keyCtrl = 17,
        keyCommand = 91,
        keyEnter = 13,
        keyEsc = 27

  // 雙鍵控制
  let isCtrlOrCommandDown = false
  w.on('keydown', function(ev) {
    // ev.preventDefault()
    console.log(ev.keyCode)
    switch(ev.keyCode) {
      case keyL:
        runKeyL()
        break
      case keyR:
        if (!isCtrlOrCommandDown) {
          runKeyR()
        }
        break
      case keyT:
        runKeyT()
        break
      case keyC:
        runKeyC()
        break
      case keyH:
        if (isCtrlOrCommandDown) {
          ev.preventDefault()
          runKeyH()
        }
        break
      case keyI:
        runKeyI()
        break
      case keyS:
        if (isCtrlOrCommandDown) {
          ev.preventDefault()
          runKeyS()
        }
        break
      case keyCtrl:
      case keyCommand:
        runKeyCommandAndCtrl()
        break
      case keyEnter:
        runKeyEnter()
        break
      case keyEsc:
        runKeyEsc()
        break
    }
  })

  w.on('keyup', function(ev) {
    switch(ev.keyCode) {
      case keyCtrl:
      case keyCommand:
        isCtrlOrCommandDown = false
      break
    }
  })

  function runKeyL() {
    if (!leftColIsRight) {
      leftCol.fadeOut(function() {
        saveDefaultSetting({ name: '左邊欄', setting: { title: '隱藏' } })
        if (rightColIsRight) {
          contentCol.css('cssText', 'width: 100% !important; margin-left: 0px !important;')
        }
      })
      leftColIsRight = true
    } else {
      saveDefaultSetting({ name: '左邊欄', setting: { title: '顯示' } })
      leftCol.fadeIn()
      contentCol.css('cssText', '')
      leftColIsRight = false
      const nowScroll = window.scrollY
      window.scrollTo(0, nowScroll + 10)
    }
  }
  function runKeyR() {
    if (!rightColIsRight) {
      rightCol.fadeOut(function() {
        saveDefaultSetting({ name: '右邊欄', setting: { title: '隱藏' } })
        //FIXME 修正右方區塊消失後，導致中間整體偏移至右邊
        contentArea.css('cssText', 'width: 100% !important; left: 0px;')
        if (leftColIsRight) {
          contentCol.css('cssText', 'width: 100% !important; margin-left: 0px !important;')
        }
      })
      rightColIsRight = true
    } else {
      saveDefaultSetting({ name: '右邊欄', setting: { title: '顯示' } })
      rightCol.fadeIn()
      contentArea.css('cssText', '')
      contentCol.css('cssText', '')
      rightColIsRight = false
      const nowScroll = window.scrollY
      window.scrollTo(0, nowScroll + 10)
    }
  }
  function runKeyT() {
    if (topIsHidden) {
      pageLetBlueBar.css({
        visibility: ''
      })
      topIsHidden = false
    } else {
      pageLetBlueBar.css({
        visibility: 'hidden'
      })
      topIsHidden = true
    }
  }
  function runKeyC() {
    if (!fbMessageIsHidden) {
      fbChatSidebar.css({
        display: 'none'
      })
      fbMessageWrapperRight.css({
        display: 'none'
      })
      fbMessageIsHidden = true
    } else {
      fbChatSidebar.css({
        display: 'block'
      })
      fbMessageWrapperRight.css({
        display: 'block'
      })
      fbMessageIsHidden = false
    }
  }
  function runKeyH() {
    window.location.href = 'https://www.facebook.com/'
  }
  function runKeyI() {
    if (!fbActiveIsHidden) {
      feedxSproutsContainer.slideUp()
      fbActiveIsHidden = true
    } else {
      feedxSproutsContainer.slideDown()
      fbActiveIsHidden = false
    }
  }
  function runKeyS() {
    if (fbSearchIsHidden)  {
      searchBarCloneContainer[0].style.display = 'block'
      inputtext[0].focus()
      inputtext[0].value = ''
      fbSearchIsHidden = false
    } else {
      searchBarCloneContainer[0].style.display = 'none'
      fbSearchIsHidden = true
    }
  }
  function runKeyCommandAndCtrl() {
    isCtrlOrCommandDown = true
  }
  function runKeyEnter() {
    searchBarCloneContainer[0].style.display = 'none'
    fbSearchIsHidden = true
  }
  function runKeyEsc() {
    if (!fbSearchIsHidden) {
      searchBarCloneContainer[0].style.display = 'none'
    }
  }


  // save function

  function saveDefaultSetting(options) {
    const settingDefaultCheck = window.confirm(`要儲存預設設定${options.name}為${options.setting.title}嗎?`)
    switch(options.name) {
      case '右邊欄':
        window.localStorage.setItem('facebook-refined-rightCol', settingDefaultCheck)
      break
      case '左邊欄':
        window.localStorage.setItem('facebook-refined-leftCol', settingDefaultCheck)
      break
    }
  }
}($))
