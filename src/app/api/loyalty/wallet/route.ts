import { NextResponse } from 'next/server';
import { serverDb } from '../../../../data/serverDb';
import JSZip from 'jszip';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const members = serverDb.getLoyalty();
    const member = members.find(m => m.phone === phone);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Create the pass.json structure matching Apple Passbook StoreCard specifications
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.portobar.loyalty",
      serialNumber: member.cardNumber,
      teamIdentifier: "APPLE_TEAM_ID_PLACEHOLDER",
      organizationName: "PORTO-BAR",
      description: "Porto Club Loyalty Card",
      logoText: "PORTO-BAR",
      foregroundColor: "rgb(212, 175, 55)", // Gold
      backgroundColor: "rgb(8, 12, 20)",    // Premium Slate
      labelColor: "rgb(156, 163, 175)",      // Gray
      barcode: {
        message: member.cardNumber,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1"
      },
      storeCard: {
        primaryFields: [
          {
            key: "balance",
            label: "БАЛЛЫ",
            value: member.points
          }
        ],
        secondaryFields: [
          {
            key: "tier",
            label: "СТАТУС",
            value: member.tier
          },
          {
            key: "name",
            label: "ГОСТЬ",
            value: member.name
          }
        ],
        backFields: [
          {
            key: "phone",
            label: "ТЕЛЕФОН",
            value: member.phone
          },
          {
            key: "rules",
            label: "ПРАВИЛА КЛУБА",
            value: "Карта действует на первом этаже гостиницы Аструс. Накапливайте 10% кэшбек баллами за каждый заказ."
          }
        ]
      }
    };

    // Initialize JSZip package
    const zip = new JSZip();
    zip.file('pass.json', JSON.stringify(passJson, null, 2));

    // Construct simple dummy manifest.json
    const manifestJson = {
      "pass.json": "82ffde93cfad1401f8d42d3c90515e01b3d5b060"
    };
    zip.file('manifest.json', JSON.stringify(manifestJson, null, 2));
    zip.file('signature', 'mock-signature-stream-placeholder');

    // Generate zip buffer
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });

    return new Response(zipBuffer as any, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="porto_loyalty_${member.phone.replace(/[^a-zA-Z0-9]/g, '')}.pkpass"`
      }
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
