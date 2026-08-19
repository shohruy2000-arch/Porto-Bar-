import { NextResponse } from 'next/server';
import { serverDb } from '../../../data/serverDb';
import { Dish, Category, Promotion } from '../../../types';

export async function GET() {
  try {
    const dishes = serverDb.getDishes();
    const categories = serverDb.getCategories();
    const promotions = serverDb.getPromotions();
    return NextResponse.json({ dishes, categories, promotions });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'addDish') {
      const dishes = serverDb.getDishes();
      const newDish: Dish = { ...data, id: `dish-${Date.now()}` };
      dishes.push(newDish);
      serverDb.saveDishes(dishes);
      return NextResponse.json(newDish);
    }

    if (action === 'updateDish') {
      const dishes = serverDb.getDishes();
      const index = dishes.findIndex(d => d.id === data.id);
      if (index === -1) return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
      dishes[index] = { ...dishes[index], ...data };
      serverDb.saveDishes(dishes);
      return NextResponse.json(dishes[index]);
    }

    if (action === 'deleteDish') {
      const dishes = serverDb.getDishes();
      const filtered = dishes.filter(d => d.id !== data.id);
      serverDb.saveDishes(filtered);
      return NextResponse.json({ success: true });
    }

    if (action === 'addCategory') {
      const categories = serverDb.getCategories();
      const newCategory: Category = { ...data, id: `cat-${Date.now()}` };
      categories.push(newCategory);
      serverDb.saveCategories(categories);
      return NextResponse.json(newCategory);
    }

    if (action === 'deleteCategory') {
      const categories = serverDb.getCategories();
      const filtered = categories.filter(c => c.id !== data.id);
      serverDb.saveCategories(filtered);
      return NextResponse.json({ success: true });
    }

    if (action === 'addPromotion') {
      const promos = serverDb.getPromotions();
      const newPromo: Promotion = { ...data, id: `promo-${Date.now()}` };
      promos.push(newPromo);
      serverDb.savePromotions(promos);
      return NextResponse.json(newPromo);
    }

    if (action === 'updatePromotion') {
      const promos = serverDb.getPromotions();
      const index = promos.findIndex(p => p.id === data.id);
      if (index === -1) return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      promos[index] = { ...promos[index], ...data };
      serverDb.savePromotions(promos);
      return NextResponse.json(promos[index]);
    }

    if (action === 'deletePromotion') {
      const promos = serverDb.getPromotions();
      const filtered = promos.filter(p => p.id !== data.id);
      serverDb.savePromotions(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
