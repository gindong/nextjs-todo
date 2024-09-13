import { NextRequest, NextResponse } from "next/server";
import { fetchTodos, addTodo } from '@/data/firestore'

//export const dynamic = 'force-static'

//모든할인 가져오기
export async function GET(request: NextRequest) {

  const fetchedTodos = await fetchTodos();
  const response = {
    message: '할일목록 전체 가져오기',
    data: fetchedTodos
  }
  return NextResponse.json(response,{status: 200});
}

//할일추가
export async function POST(request: NextRequest) {
  const {title} = await request.json()

  if(title === undefined) {
    const errmsg = {
      message:'타이틀이 없습니다.'
    }
    return NextResponse.json(errmsg,{status: 422});
  }

  const addToData = await addTodo({title});
  const response = {
    message: '할일 추가 성공',
    data: addToData
  }

  return Response.json(response,{status:201})
}