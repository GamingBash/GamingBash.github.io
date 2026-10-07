(() => {
  const form = document.querySelector('#concept-form');
  const prompt = document.querySelector('#concept-prompt');
  const phone = document.querySelector('#concept-phone');
  const scene = phone.scene;
  scene.independent = true;
  const pause = document.querySelector('#concept-pause');
  let stopped = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pace = .65;
  const choices = [
    ['snow', /\b(snow|winter|pine|flakes?|trees?)\b/i],
    ['soda', /\b(peach|soda|drink|bubbles?|fizz)\b/i],
    ['console', /\b(game|gaming|console|retro|handheld)\b/i],
    ['chime', /\b(chime|glass|breeze|ribbon|wind)\b/i],
    ['lantern', /\b(lantern|lamp|fireflies|firefly|light)\b/i]
  ];
  function updateMotion() {
    scene.speed = stopped ? 0 : pace;
    scene.localPaused = stopped; scene.dirty = true;
    pause.textContent = stopped ? 'Play preview' : 'Pause preview';
    pause.setAttribute('aria-pressed', String(stopped));
  }
  function preview() {
    const text = prompt.value.trim();
    if (!text) { prompt.setCustomValidity('Describe a scene or choose an example.'); prompt.reportValidity(); return; }
    prompt.setCustomValidity('');
    const match = choices.find(([, pattern]) => pattern.test(text));
    const id = match ? match[0] : 'lantern';
    const title = MopixyScenes.definitions[id].title;
    const night = /\b(night|dark|midnight|moon)\b/i.test(text);
    pace = /\b(fast|lively|energetic)\b/i.test(text) ? 1.4 : /\b(slow|slowly|calm|gentle|gently|quiet)\b/i.test(text) ? .65 : 1;
    scene.id = id; scene.night = night; phone.dataset.scene = id;
    updateMotion(); scene.dirty = true;
    MopixyScenes.ready.then(() => scene.draw(scene.t || 0));
    phone.querySelector('canvas').setAttribute('aria-label', 'Concept preview of ' + title);
    document.querySelector('#concept-result-title').textContent = title;
    document.querySelector('#concept-result-text').textContent = (match ? 'Matched to existing artwork: ' : 'That idea is outside this demo’s five scenes. Showing an existing sample: ') + title + '. ' + (night ? 'Night mood' : 'Original colours') + ', ' + (pace === .65 ? 'gentle' : pace === 1.4 ? 'lively' : 'normal') + ' motion. New objects and artwork are not generated.';
  }
  prompt.addEventListener('input', () => prompt.setCustomValidity(''));
  form.addEventListener('submit', event => { event.preventDefault(); preview(); if(prompt.value.trim())window.mopixyConceptFeedback?.(); });
  document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => { prompt.value = button.dataset.prompt; preview(); window.mopixyConceptFeedback?.(); }));
  pause.addEventListener('click', () => { stopped = !stopped; updateMotion(); });
  document.querySelector('#concept-save').addEventListener('click', async () => {
    await MopixyScenes.ready;
    scene.draw(scene.t || 0);
    phone.querySelector('canvas').toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = 'mopixy-' + scene.id + '-concept.png'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, 'image/png');
  });
  preview();
})();


