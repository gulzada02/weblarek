import { BaseCard } from './BaseCard'; 
import { CDN_URL, categoryMap } from '../utils/constants'; 
 
type CategoryKey = keyof typeof categoryMap; 
 
export class ProductCard extends BaseCard { 
  private title: HTMLElement; 
  private price: HTMLElement; 
  private image: HTMLImageElement; 
  private category: HTMLElement; 
  private onClick: () => void; 
 
  constructor(template: HTMLTemplateElement, onClick: () => void) { 
    super(template); 
    this.title = this.element.querySelector('.card__title')!; 
    this.price = this.element.querySelector('.card__price')!; 
    this.image = this.element.querySelector('.card__image')!; 
    this.category = this.element.querySelector('.card__category')!; 
    this.onClick = onClick; 
 
    this.element.addEventListener('click', () => this.onClick()); 
  } 
 
  setTitle(text: string) { 
    this.title.textContent = text; 
  } 
 
  setPrice(value: number | null) { 
  const btn = this.element.querySelector('button') as HTMLButtonElement | null; 
 
  if (value === null) { 
    this.price.textContent = 'Недоступно'; 
    if (btn) { 
      btn.textContent = 'Недоступно'; 
      btn.disabled = true; 
    } 
  } else { 
    this.price.textContent = `${value} синапсов`; 
    if (btn) { 
      btn.textContent = 'В корзину'; 
      btn.disabled = false; 
    } 
  } 
} 
 
 updateImage(productImage: string) {
  const src = `${CDN_URL}/${productImage}`;
  const alt = this.title.textContent || 'product';
  super.setImage(this.image, src, alt);
}


 setCategory(name: string) { 
  this.category.textContent = name; 
  const key = name.toLowerCase() as CategoryKey;  
  const modifier = categoryMap[key]; 
  if (modifier) { 
    this.category.classList.add(modifier); 
  }   
} 
 
 
} 