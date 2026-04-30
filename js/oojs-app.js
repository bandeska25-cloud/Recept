(function () {
  const canvas = document.getElementById('oojs-canvas');
  const ctx = canvas.getContext('2d');
  const countEl = document.getElementById('count');

  const info = document.createElement('div');
  info.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#14532d;color:white;padding:0.5rem 0.8rem;border-radius:6px;font-size:0.8rem;font-family:monospace;z-index:5;';
  info.textContent = 'OOJS recept demo';
  document.body.appendChild(info);

  class KitchenObject {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3.5;
      this.vy = (Math.random() - 0.5) * 3.5;
      this.rotation = Math.random() * Math.PI;
      this.spin = (Math.random() - 0.5) * 0.05;
    }

    update() {
      this.vy += 0.08;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.spin;

      if (this.x < 22 || this.x > canvas.width - 22) this.vx *= -0.9;
      if (this.y > canvas.height - 22) {
        this.y = canvas.height - 22;
        this.vy *= -0.82;
      }
      if (this.y < 22) this.vy *= -0.7;
      this.x = Math.max(22, Math.min(canvas.width - 22, this.x));
    }

    drawLabel(text) {
      ctx.save();
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.textAlign = 'center';
      ctx.fillText(text, this.x, this.y + 34);
      ctx.restore();
    }

    draw() {
      throw new Error('A draw metodust a leszarmazott osztaly valositja meg.');
    }
  }

  class IngredientBubble extends KitchenObject {
    constructor(x, y) {
      super(x, y);
      this.radius = 16 + Math.random() * 18;
      this.label = ['só', 'rizs', 'tojás', 'bors', 'tejföl', 'hagyma'][Math.floor(Math.random() * 6)];
      this.color = ['#ef4444', '#f97316', '#22c55e', '#84cc16', '#eab308'][Math.floor(Math.random() * 5)];
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.radius * 1.12, this.radius * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.ellipse(-this.radius * 0.35, -this.radius * 0.3, this.radius * 0.28, this.radius * 0.18, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      this.drawLabel(this.label);
    }
  }

  class SpiceStar extends IngredientBubble {
    constructor(x, y) {
      super(x, y);
      this.points = 6;
      this.radius = 18 + Math.random() * 16;
      this.label = ['majoranna', 'paprika', 'kömény', 'kapor'][Math.floor(Math.random() * 4)];
      this.color = ['#d97706', '#dc2626', '#facc15', '#16a34a'][Math.floor(Math.random() * 4)];
    }

    update() {
      super.update();
      this.spin += 0.0008;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#fff7ed';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < this.points * 2; i++) {
        const r = i % 2 === 0 ? this.radius : this.radius / 2;
        const a = (Math.PI / this.points) * i;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      this.drawLabel(this.label);
    }
  }

  const objects = [];

  function paintKitchen() {
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, '#10291c');
    grd.addColorStop(0.65, '#164e35');
    grd.addColorStop(1, '#7c2d12');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(90 + i * 115, 70 + Math.sin(Date.now() / 900 + i) * 15, 45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    paintKitchen();
    objects.forEach(o => { o.update(); o.draw(); });
    countEl.textContent = objects.length;
    requestAnimationFrame(animate);
  }

  function getXY(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  canvas.addEventListener('click', (e) => {
    const { x, y } = getXY(e);
    objects.push(e.shiftKey ? new SpiceStar(x, y) : new IngredientBubble(x, y));
  });

  document.getElementById('add-ingredient').addEventListener('click', () => {
    objects.push(new IngredientBubble(Math.random() * canvas.width, 60));
  });
  document.getElementById('add-spice').addEventListener('click', () => {
    objects.push(new SpiceStar(Math.random() * canvas.width, 60));
  });
  document.getElementById('clear').addEventListener('click', () => {
    objects.length = 0;
  });

  for (let i = 0; i < 6; i++) objects.push(new IngredientBubble(120 + i * 115, 60));
  objects.push(new SpiceStar(450, 90));
  animate();
})();
