import * as words from "../wordleWords.json"
export async function GET({}) {
    return new Response(
        JSON.stringify(words)
    )
}