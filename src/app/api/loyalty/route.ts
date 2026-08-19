import { NextResponse } from 'next/server';
import { serverDb } from '../../../data/serverDb';
import { LoyaltyMember, LoyaltyTransaction, LoyaltyTier } from '../../../types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) {
      const members = serverDb.getLoyalty();
      return NextResponse.json(members);
    }

    const members = serverDb.getLoyalty();
    const cleanedSearch = phone.replace(/\D/g, '');
    const member = members.find(m => m.phone.replace(/\D/g, '') === cleanedSearch);

    if (!member) return NextResponse.json(null);
    return NextResponse.json(member);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (action === 'addMember') {
      const members = serverDb.getLoyalty();
      const cleanedPhone = data.phone.replace(/\D/g, '');
      const exists = members.some(m => m.phone.replace(/\D/g, '') === cleanedPhone);
      
      if (exists) {
        return NextResponse.json({ error: 'Member already exists' }, { status: 400 });
      }

      const newMember: LoyaltyMember = {
        ...data,
        cardNumber: `PB-${cleanedPhone.slice(-7, -4)}-${cleanedPhone.slice(-4)}`,
        qrCode: `PB-${cleanedPhone.slice(-7, -4)}-${cleanedPhone.slice(-4)}`,
        registrationDate: new Date().toLocaleDateString('ru-RU'),
        points: data.points || 0,
        tier: data.tier || 'Bronze',
        history: data.history || [
          {
            date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            amount: data.points || 0,
            type: 'accrual',
            comment: 'Приветственные баллы при регистрации'
          }
        ]
      };
      
      members.push(newMember);
      serverDb.saveLoyalty(members);
      return NextResponse.json(newMember);
    }

    if (action === 'updatePoints') {
      const members = serverDb.getLoyalty();
      const cleanedSearch = data.phone.replace(/\D/g, '');
      const index = members.findIndex(m => m.phone.replace(/\D/g, '') === cleanedSearch);
      
      if (index === -1) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
      }

      const member = members[index];
      const amount = data.amount;
      const type = data.type as 'accrual' | 'deduction';
      const comment = data.comment || '';

      const newPoints = type === 'accrual' ? member.points + amount : Math.max(0, member.points - amount);
      
      let newTier: LoyaltyTier = 'Bronze';
      if (newPoints >= 1500) newTier = 'Porto Premium';
      else if (newPoints >= 500) newTier = 'Gold';
      else if (newPoints >= 100) newTier = 'Silver';

      const transaction: LoyaltyTransaction = {
        date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        amount,
        type,
        comment
      };

      const updatedMember: LoyaltyMember = {
        ...member,
        points: newPoints,
        tier: newTier,
        history: [transaction, ...member.history]
      };

      members[index] = updatedMember;
      serverDb.saveLoyalty(members);
      return NextResponse.json(updatedMember);
    }

    return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
