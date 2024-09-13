import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-static'
 
export async function GET(request: NextRequest) {
  const response = {
    message: '메시지 테스트',
    data: '데이터'
  }
  return NextResponse.json(response,{status: 201});
}