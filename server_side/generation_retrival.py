import embeddings_vectordb
from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import ast
import pickle
from langchain_community.document_loaders import PyMuPDFLoader
from storage.database import crud

# loader = PyMuPDFLoader("data\pdf.pdf")
# docs = loader.load()
# vector_store = embeddings_vectordb.process(docs)

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def gen_ret(
    query: str, vector_store, uuid: str, username: str, is_multiple: bool = False
):

    if is_multiple:
        raw = crud.get_user_context_multiple(username, uuid)
    else:
        raw = crud.get_user_context(username, uuid)
    message_history = raw if isinstance(raw, list) else []

    def retrieve(query: str):
        retrieved_docs = vector_store.similarity_search(query, k=2)
        serialized = "\n\n".join(
            (f"Source: {doc.metadata}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )
        return serialized

    tools = [
        {
            "type": "function",
            "name": "retrieve",
            "description": "Retrieve information related to a query.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string"}},
                "required": ["query"],
                "additionalProperties": False,
            },
            "strict": True,
        }
    ]
    condition = ", answer strictly based on the context received , if you don't find it, say 'could not find exactly'.If user greets,greet user back, also end response with a full stop. "
    message_history.append({"role": "user", "content": f"{query}{condition}"})

    tool_response = client.responses.create(
        model="gpt-4o-mini", input=message_history, tools=tools, tool_choice="auto"
    )

    tool_call = tool_response.output[0]

    if tool_call.type == "function_call":
        args = json.loads(tool_call.arguments)

        result = retrieve(args["query"])

        message_history.append(tool_call.model_dump())
        message_history.append(
            {
                "type": "function_call_output",
                "call_id": tool_call.call_id,
                "output": str(result),
            }
        )

    final_response = client.responses.create(
        model="gpt-4o-mini", input=message_history, tools=tools, stream=True
    )

    for chunck in final_response:
        if chunck.__class__.__name__ == "ResponseTextDeltaEvent":
            yield chunck.delta
        elif chunck.__class__.__name__ == "ResponseCompletedEvent":
            message_history.append(
                {
                    "role": "assistant",
                    "content": chunck.response.output[0].content[0].text,
                }
            )
            break

    if is_multiple:
        crud.update_context_field_multiple(username, uuid, message_history)
    else:
        crud.update_context_field(username, uuid, message_history)


# x = gen_ret("about which war I asked you just now?",vector_store)
# print(x)
