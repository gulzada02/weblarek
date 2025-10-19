import { BaseCard } from './BaseCard'; 
import { CDN_URL, categoryMap } from '../../utils/constants'; 
 
type CategoryKey = keyof typeof categoryMap; 
 
export class ProductCard extends BaseCard { 
  private _CDN_URL = CDN_URL;
  setCardImage(src: string) {
    let url = src;
    if (!src.endsWith('.png')) {
      const dot = src.lastIndexOf('.');
      url = dot !== -1 ? src.slice(0, dot) + '.png' : src + '.png';
    }
    this.setImage(this.image, this._CDN_URL + url, this.title.textContent || '');
  }
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

 setCategory(name: string) { 
  this.category.textContent = name; 
  const key = name.toLowerCase() as CategoryKey;  
  const modifier = categoryMap[key]; 
  if (modifier) { 
    this.category.classList.add(modifier); 
  }   
} 
}