import { NextRequest, NextResponse } from 'next/server';
import * as cartService from '@/server/actions/cartService';

export async function GET() {
  try {
    const items = await cartService.getCartItems();
    return NextResponse.json(items);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await cartService.addMultipleToCart(body.items);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await cartService.updateCartItem(
      body.productId,
      body.quantity
    );
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.productId) {
      await cartService.removeCartItem(body.productId);
    } else {
      await cartService.clearCart();
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
