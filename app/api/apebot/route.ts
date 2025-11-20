import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the actual Apebot API
    const response = await fetch('https://a-ok.shop/apebot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization header if present
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!,
        }),
      },
      body: JSON.stringify(body),
    });

    // If the response isn't ok, return the error
    if (!response.ok) {
      console.error(`Apebot API error: ${response.status}`);

      // For development, return a mock response if the API is unavailable
      if (response.status === 403 || response.status === 404) {
        return NextResponse.json(
          {
            message: `I'd love to help you find "${body.message}", but I'm currently in demo mode. Try visiting A-OK.shop directly to explore our full collection!`,
            suggestions: ['Visit A-OK.shop', 'Browse products', 'Try again'],
          },
          { status: 200 }
        );
      }

      throw new Error(`Apebot API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Apebot proxy:', error);

    return NextResponse.json(
      {
        message:
          "I'm having trouble connecting right now. Please visit A-OK.shop directly or try again later!",
        suggestions: ['Visit A-OK.shop', 'Try again'],
      },
      { status: 200 }
    );
  }
}
