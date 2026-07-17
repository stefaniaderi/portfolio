// ── Draft field: drag + hover scale (whole card) ─────────────────────────────

document.querySelectorAll('.draft-field').forEach(function(field) {

  var topZ = field.querySelectorAll('.draft-card').length + 1
  var drag = null

  field.querySelectorAll('.draft-card').forEach(function(card) {

    var rotate = parseFloat(card.dataset.rotate) || 0

    card.addEventListener('mouseenter', function() {
      if (drag && drag.card === card) return
      card.style.transform = 'rotate(' + rotate + 'deg) scale(1.07)'
    })

    card.addEventListener('mouseleave', function() {
      if (drag && drag.card === card) return
      card.style.transform = 'rotate(' + rotate + 'deg) scale(1)'
    })


    card.addEventListener('pointerdown', function(e) {

      card.setPointerCapture(e.pointerId)

      var rect = field.getBoundingClientRect()

      topZ++
      card.style.zIndex = topZ
      card.style.transition = 'none'
      card.style.cursor = 'grabbing'

      drag = {

        card: card,
        rotate: rotate,

        // posizione iniziale del mouse relativa al field
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,

        // posizione iniziale della card
        origX: parseFloat(card.style.left) || 0,
        origY: parseFloat(card.style.top) || 0,

        movedX: e.clientX,
        movedY: e.clientY
      }

    })

  })


  field.addEventListener('pointermove', function(e) {

    if (!drag) return

    var rect = field.getBoundingClientRect()

    var mouseX = e.clientX - rect.left
    var mouseY = e.clientY - rect.top

    var x = drag.origX + (mouseX - drag.startX)
    var y = drag.origY + (mouseY - drag.startY)

    drag.card.style.left = x + 'px'
    drag.card.style.top = y + 'px'

    drag.card.style.transform =
      'rotate(' + drag.rotate + 'deg) scale(1.07)'

  })


  function endDrag(e) {

    if (!drag) return

    drag.card.style.transition =
      'transform .35s cubic-bezier(.22,1,.36,1)'

    drag.card.style.transform =
      'rotate(' + drag.rotate + 'deg) scale(1)'

    drag.card.style.cursor = 'grab'


    var moved =
      Math.abs(e.clientX - drag.movedX) +
      Math.abs(e.clientY - drag.movedY)


    if (moved < 6 && drag.card.dataset.href) {
      window.location.href = drag.card.dataset.href
    }


    // aggiorna anche i dati per eventuali salvataggi futuri
    drag.card.dataset.x = parseFloat(drag.card.style.left)
    drag.card.dataset.y = parseFloat(drag.card.style.top)


    drag = null

  }


  field.addEventListener('pointerup', endDrag)
  field.addEventListener('pointercancel', endDrag)

})

// ── Accordion ────────────────────────────────────────────────────────────────

document.querySelectorAll('.accordion-trigger').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item  = btn.closest('.accordion-item')
    var panel = item.querySelector('.accordion-panel')
    var icon  = btn.querySelector('.accordion-icon')
    var open  = panel.style.display !== 'none'
    document.querySelectorAll('.accordion-panel').forEach(function(p) { p.style.display = 'none' })
    document.querySelectorAll('.accordion-icon').forEach(function(ic) { ic.style.transform = 'none' })
    if (!open) { panel.style.display = 'block'; icon.style.transform = 'rotate(45deg)' }
  })
})

// ── Work grid hover ───────────────────────────────────────────────────────────

document.querySelectorAll('.work-card').forEach(function(card) {
  var img   = card.querySelector('.work-img')
  var title = card.querySelector('.work-title')
  card.addEventListener('mouseenter', function() {
    if (img)   { img.style.filter = 'none'; img.style.mixBlendMode = 'normal'; img.style.transform = 'scale(1.025)' }
    if (title) { title.style.color = 'var(--accent)' }
  })
  card.addEventListener('mouseleave', function() {
    if (img)   { img.style.filter = 'grayscale(1)'; img.style.mixBlendMode = 'multiply'; img.style.transform = 'scale(1)' }
    if (title) { title.style.color = '' }
  })
})

// ── IT / EN toggle ────────────────────────────────────────────────────────────
// In Kirby la lingua è gestita lato server via Kirby's multi-language feature.
// Questo JS gestisce solo l'UI del toggle se si usa Kirby in modalità single-language.

document.querySelectorAll('.lang-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var lang = btn.dataset.lang
    document.cookie = 'lang=' + lang + ';path=/;max-age=31536000'
    window.location.href = '/' + lang + window.location.pathname.replace(/^\/(it|en)/, '')
  })
})
