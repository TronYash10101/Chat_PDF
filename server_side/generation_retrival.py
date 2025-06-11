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

File = r"D:\RAG2\data\history.json"

if os.path.exists(File):
    with open(File, 'rb') as f:
        message_history = pickle.load(f)
else:
    message_history = []


def gen_ret(query: str,vector_store):
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)

    def retrieve(query: str):
        retrieved_docs = vector_store.similarity_search(query, k=2)
        serialized = "\n\n".join(
            (f"Source: {doc.metadata}\nContent: {doc.page_content}")
            for doc in retrieved_docs
        )
        return serialized

    tools = [{
        "type": "function",
        "name": "retrieve",
        "description": "Retrieve information related to a query.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string"}
            },
            "required": ["query"],
            "additionalProperties": False
        },
        "strict": True
    }]
    condition = ", answer strictly based on the context received and answer even if you find some similarity, if you still don't find it, say 'could not find exactly'.If user greets,greet user back"
    message_history.append({"role": "user", "content": f"{query}{condition}"})

    tool_response = client.responses.create(
        model="gpt-4o-mini",
        input=message_history,
        tools=tools,
        tool_choice="auto"
    )

    tool_call = tool_response.output[0]

    if tool_call.type == "function_call":
        args = json.loads(tool_call.arguments)

        result = retrieve(args["query"])

        message_history.append(tool_call)
        message_history.append({
            "type": "function_call_output",
            "call_id": tool_call.call_id,
            "output": str(result)
        })

        final_response = client.responses.create(
            model="gpt-4o-mini",
            input=message_history,
            tools=tools,
        )
        answer = final_response.output[0].content[0].text 
        
    elif tool_call.type == "message":
        answer = tool_call.content[0].text
        
    # print(answer)
    message_history.append({"role": "assistant", "content": answer})
    with open(File, 'wb') as f:
        pickle.dump(message_history, f)
    print(message_history)
    # print(tool_call)
    return answer

# x = gen_ret("about which war I asked you just now?",vector_store)
# print(x)

