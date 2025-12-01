// Personal Blog Click Animation Effects

// 花瓣飞舞效果 - 修改为点击时以点击位置为中心散开一圈
class PetalEffect {
  constructor() {
    this.petalCount = 15; // 每次点击创建15个花瓣
    this.petalChars = ['★', '☆', '✦', '✧', '⭐', '🌟', '✨', '💫', '⋆', '⚝', '🌠'];
    this.petalColors = [
      '#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0', 
      '#B0B0B0', '#A0A0A0', '#909090', '#808080', 
      '#707070', '#606060'
    ];
    this.bindEvents();
  }

  bindEvents() {
    // 监听整个文档的点击事件
    document.addEventListener('click', (e) => {
      this.createPetalCircle(e.clientX, e.clientY);
    });
  }

  // 创建花瓣圆环
  createPetalCircle(x, y) {
    const radius = 100; // 增加圆环半径

    for (let i = 0; i < this.petalCount; i++) {
      // 计算每个花瓣在圆环上的位置
      const angle = (i / this.petalCount) * Math.PI * 2;
      const petalX = x + radius * Math.cos(angle);
      const petalY = y + radius * Math.sin(angle);

      // 创建花瓣元素
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.innerHTML = this.petalChars[Math.floor(Math.random() * this.petalChars.length)];

      // 设置花瓣样式
      petal.style.left = x + 'px';
      petal.style.top = y + 'px';
      petal.style.color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
      petal.style.fontSize = (Math.random() * 15 + 25) + 'px'; // 增大花瓣尺寸
      petal.style.opacity = '1';

      // 添加到页面
      document.body.appendChild(petal);

      // 使用requestAnimationFrame确保元素被添加到DOM后再启动动画
      requestAnimationFrame(() => {
        // 设置动画变量
        const tx = (petalX - x) * 2;
        const ty = (petalY - y) * 2;
        const rotation = Math.random() * 720; // 增加旋转角度

        petal.style.setProperty('--tx', tx + 'px');
        petal.style.setProperty('--ty', ty + 'px');
        petal.style.setProperty('--r', rotation + 'deg');
        petal.style.animation = `petal-fall ${Math.random() * 1.5 + 1.5}s ease-out forwards`; // 延长动画时间
      });

      // 动画结束后移除元素
      setTimeout(() => {
        if (petal.parentNode) {
          petal.parentNode.removeChild(petal);
        }
      }, 2000); // 延长移除时间
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // 初始化花瓣效果
  new PetalEffect();
  
  // 添加点击动画到所有按钮和链接
  const clickableElements = document.querySelectorAll('button, a, .btn');
  
  clickableElements.forEach(element => {
    // 添加点击动画类
    element.classList.add('click-animation');
    
    // 添加涟漪效果点击事件
    element.addEventListener('click', function(e) {
      // 移除任何现有的涟漪元素
      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }
      
      // 创建涟漪元素
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // 定位涟漪在点击位置
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      // 动画完成后移除涟漪
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // 添加悬停效果到导航链接
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 0 15px var(--blog-accent)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });
  
  // 添加增强的悬停效果到按钮
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
    
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
      this.style.backgroundColor = 'var(--blog-click-effect)';
      this.style.boxShadow = '0 0 20px var(--blog-click-effect)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.backgroundColor = ''; // 重置为原始颜色
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
  });
});