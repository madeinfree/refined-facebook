(function(jq) {
  const fbMessageWrapperRight = jq('.fbDockWrapperRight'),
        leftCol = jq('#leftCol'),
        rightCol = jq('#rightCol'),
        pageLetBlueBar = jq('#pagelet_bluebar'),
        w = jq(window)

  let rightColIsRight = false,
      leftColIsRight = false

  document.body.style.overflowX = 'hidden'

  fbMessageWrapperRight.css({
    display: 'none'
  })
  leftCol.css({
    transform: 'translateX(-500px)',
    transition: 'all .3s'
  })
  rightCol.css({
    transform: 'translateX(500px)',
    transition: 'all .3s'
  })
  pageLetBlueBar.css({
    visibility: 'hidden'
  })

  const rightPanelButton = $('<div><= Open Right Panel</div>')
  rightPanelButton.attr('id', 'rightPanelButton')
  rightPanelButton.css({
    position: 'absolute',
    top: '0px',
    right: '0px',
    cursor: 'pointer'
  })
  rightPanelButton.on('click', function() {
    if (!rightColIsRight) {
      rightCol.css({
        transform: 'translateX(0px)'
      })
      rightColIsRight = true
    } else {
      rightCol.css({
        transform: 'translateX(500px)'
      })
      rightColIsRight = false
    }
  })
  document.body.appendChild(rightPanelButton[0])

  const leftPanelButton = $('<div>Open Left Panel =></div>')
  leftPanelButton.attr('id', 'leftPanelButton')
  leftPanelButton.css({
    position: 'absolute',
    top: '0px',
    cursor: 'pointer'
  })
  leftPanelButton.on('click', function() {
    if (!leftColIsRight) {
      leftCol.css({
        transform: 'translateX(0px)'
      })
      leftColIsRight = true
    } else {
      leftCol.css({
        transform: 'translateX(-500px)'
      })
      leftColIsRight = false
    }
  })
  document.body.appendChild(leftPanelButton[0])

  w.on('scroll', function(ev) {
    const scrollTop = w.scrollTop()
    if (scrollTop > 60) {
      pageLetBlueBar.css({
        visibility: ''
      })
    } else {
      pageLetBlueBar.css({
        visibility: 'hidden'
      })
    }
  })
}($))
