(function () {
  'use strict';

  var form = document.getElementById('whatsappLeadForm');

  if (!form) {
    return;
  }

  var whatsappNumber = '5562998220215';
  var feedback = form.querySelector('.lead-form-feedback');
  var phoneInput = form.elements.telefone;

  phoneInput.addEventListener('input', function () {
    var digits = this.value.replace(/\D/g, '').slice(0, 11);
    var formatted = digits;

    if (digits.length > 2) {
      formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    }
    if (digits.length === 10) {
      formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
    } else if (digits.length === 11) {
      formatted = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
    }

    this.value = formatted;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    form.querySelectorAll('.is-invalid').forEach(function (field) {
      field.classList.remove('is-invalid');
    });

    var phoneDigits = phoneInput.value.replace(/\D/g, '');
    var firstInvalidField = null;

    phoneInput.setCustomValidity('');

    Array.prototype.forEach.call(form.elements, function (field) {
      if (field.willValidate && !field.checkValidity() && !firstInvalidField) {
        firstInvalidField = field;
      }
    });

    if (phoneDigits.length < 10) {
      phoneInput.setCustomValidity('Informe um número de WhatsApp válido com DDD.');
      firstInvalidField = firstInvalidField || phoneInput;
    } else {
      phoneInput.setCustomValidity('');
    }

    if (firstInvalidField) {
      firstInvalidField.classList.add('is-invalid');
      if (firstInvalidField.type === 'checkbox') {
        firstInvalidField.closest('.lead-form-consent').classList.add('is-invalid');
      }
      feedback.textContent = firstInvalidField.validationMessage || 'Revise os campos obrigatórios antes de continuar.';
      feedback.classList.add('is-visible');
      firstInvalidField.focus();
      return;
    }

    feedback.textContent = '';
    feedback.classList.remove('is-visible');

    var messageLines = [
      'Olá! Vim pelo site da Ageu e preenchi o formulário de atendimento.',
      '',
      '*Nome:* ' + form.elements.nome.value.trim(),
      '*WhatsApp:* ' + phoneInput.value.trim(),
      '*E-mail:* ' + form.elements.email.value.trim(),
      '*Cidade / Estado:* ' + form.elements.localizacao.value.trim(),
      '*Serviço de interesse:* ' + form.elements.servico.value
    ];

    var details = form.elements.mensagem.value.trim();
    if (details) {
      messageLines.push('*Detalhes:* ' + details);
    }

    var whatsappUrl = 'https://api.whatsapp.com/send?phone=' + whatsappNumber + '&text=' + encodeURIComponent(messageLines.join('\n'));
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}());
