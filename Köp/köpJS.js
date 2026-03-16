// LANGUAGE
function setLang(lang) {
    document.querySelectorAll('[data-sv]').forEach(function (el) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        var val = el.getAttribute('data-' + lang);
        if (val) el.textContent = val;
    });

    document.querySelectorAll('select option[data-sv]').forEach(function (opt) {
        var val = opt.getAttribute('data-' + lang);
        if (val) opt.textContent = val;
    });

    document.getElementById('btnSV').classList.toggle('active', lang === 'sv');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    window._lang = lang;
}

document.getElementById('btnSV').addEventListener('click', function () { setLang('sv'); });
document.getElementById('btnEN').addEventListener('click', function () { setLang('en'); });
setLang('sv');


// MODEL PICKER
var selectedVariant = '';

document.querySelectorAll('.modelCard').forEach(function (card) {
    card.addEventListener('click', function () {
        document.querySelectorAll('.modelCard').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        selectedVariant = card.getAttribute('data-variant');
        document.getElementById('variant').value = selectedVariant;
        // clear error
        document.getElementById('err-variant').classList.remove('show');
        document.querySelector('.modelPicker').classList.remove('error');
    });
});


// VALIDATION HELPERS
function showErr(id, show) {
    var msg = document.getElementById('err-' + id);
    var field = document.getElementById(id);
    if (msg) msg.classList.toggle('show', show);
    if (field) field.classList.toggle('error', show);
}

['fname', 'lname', 'email', 'phone', 'org', 'country', 'qty'].forEach(function (id) {
    var field = document.getElementById(id);
    if (field) {
        field.addEventListener('input', function () { showErr(id, false); });
        field.addEventListener('change', function () { showErr(id, false); });
    }
});

document.getElementById('terms').addEventListener('change', function () { showErr('terms', false); });


// FORM SUBMIT
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    var checks = [
        { id: 'fname', test: function (v) { return v.trim().length > 0; } },
        { id: 'lname', test: function (v) { return v.trim().length > 0; } },
        { id: 'email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'phone', test: function (v) { return v.trim().length >= 7; } },
        { id: 'org', test: function (v) { return v.trim().length > 0; } },
        { id: 'country', test: function (v) { return v !== ''; } },
        { id: 'qty', test: function (v) { return parseInt(v) >= 1; } }
    ];

    checks.forEach(function (c) {
        var val = document.getElementById(c.id).value;
        var ok = c.test(val);
        showErr(c.id, !ok);
        if (!ok) valid = false;
    });

    // variant check
    if (!selectedVariant) {
        document.getElementById('err-variant').classList.add('show');
        document.querySelector('.modelPicker').classList.add('error');
        valid = false;
    }

    var termsOk = document.getElementById('terms').checked;
    showErr('terms', !termsOk);
    if (!termsOk) valid = false;

    if (valid) {
        // hide form, show thank you
        document.querySelector('.formCard').style.display = 'none';
        var ty = document.getElementById('thankYou');
        ty.classList.add('show');
        ty.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});