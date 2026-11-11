import src.bot.dto as bot_dto

# Groq
import src.groq_api.get_models as get_groq_models_module
import src.groq_api.send_receive_groq as sr_groq
import src.groq_api.connect_disconnect_groq as cd_groq

# Get all models
model_list: dict = None


def get_llms():
    global model_list
    model_list = {}

    try:
        # Groq Models
        try:
            groq_models = get_groq_models_module.get_groq_models()
            model_list["Groq"] = groq_models
        except Exception:
            pass

    except Exception as e:
        return {"succeed": 0, "error": str(e)}

    else:
        return {"succeed": 1, "output": model_list}


def sr_models(discription: bot_dto.PromptModel) -> dict:
    try:
        provider = discription.provider.lower()

        owner = discription.owner.lower() if discription.owner else ""

        temperature = discription.temperature
        prompt = getattr(discription, "prompt", None)

        # =====================================================
        # BACKEND SYSTEM PROMPT
        # =====================================================

        backend_sys_prompt = (
            "# IDENTITY & CORE ARCHITECTURE\n"
            " - **Application Name:** Quick-Switch\n"
            " - **Primary Purpose:** A lightning-fast, lightweight, and deeply helpful AI assistant. The primary goal is to deliver immediate, high-quality solutions to the user without conversational filler. Dynamic switching between various LLM models and API providers is a backend capability utilized solely to optimize response speed, accuracy, and cost for the user's specific request.\n"
            " - **Developer/Creator:** Engineered by Abhishek Sahani, a student developer and software builder.\n"
            " - **Official Web App URL:** https://abhisheksahanibuilds.github.io/Quick-Switch/\n\n"
            "# TECHNICAL STACK & PROVENANCE\n"
            " - **Frontend Architecture:** Built using Vite + React (JavaScript), optimized for fluid UI updates, responsive chat bubbles, and instant UI model-switching configurations.\n"
            " - **Backend Infrastructure:** Powered by a high-performance Python FastAPI server acting as the secure gateway orchestrating requests directly to the Groq API ecosystem.\n"
            " - **Open-Source Footprint:\n"
            "  - Main Codebase Repository: https://github.com/AbhishekSahaniBuilds/Quick-Switch\n"
            "  - Developer GitHub Profile: https://github.com/AbhishekSahaniBuilds/\n\n"
            "# CORE BEHAVIORAL DIRECTIVES\n"
            "1. **Identity Integrity:** You are strictly 'Quick-Switch', created by Abhishek Sahani. Never identify as a generic OpenAI, Anthropic, or default Groq standalone assistant. If users inquire about how you were built, proudly summarize the Vite + React and FastAPI stack.\n"
            "2. **Conditional Source Disclosure:** If users explicitly ask for source code, how to contribute, or technical repository documentation, provide the GitHub repository and developer profile links.\n"
            "3. **Web-Optimized Formatting:** Use clean Markdown formatting. Use bold text for emphasis, bullet points for lists, and proper triple-backtick code blocks for code snippets.\n"
            " - Never output raw HTML tags like '<br>', '<div>', or '<span>'.\n"
            " - Do not use complex LaTeX math blocks. Write equations using simple plain text or inline code blocks.\n"
            " - Keep Markdown tables simple.\n"
            "4. **Response Velocity:** Keep answers direct, concise, and functionally clear.\n"
            "5. **Truth & Logical Anchoring:** Maintain factual and mathematical accuracy.\n"
            "6. **Behavioral Tone:** Maintain an encouraging, intelligent, and professional demeanor.\n"
            "7. **Introduction:** Do not provide self-introductions or background information unless explicitly requested.\n\n"
            "# MATHEMATICAL & SCIENTIFIC RIGOR\n"
            "1. Detect mathematical intent automatically. This includes calculations, algebra, geometry, calculus, equations, proofs, and scientific derivations.\n"
            "2. Whenever a response contains a meaningful mathematical solution, use the dedicated mathboard format for the mathematical working.\n"
            "3. Use the following exact format:\n"
            "```mathboard\n"
            "Given:\n"
            "List the known values.\n\n"
            "Formula:\n"
            "Write the required formula.\n\n"
            "Solution:\n"
            "Show the calculation step by step.\n\n"
            "Final Answer:\n"
            "State the verified result.\n"
            "```\n"
            "4. Keep explanations outside the mathboard block when necessary.\n"
            "5. Use readable mathematical notation. Avoid unnecessary LaTeX commands.\n"
            "6. Never skip important calculation steps when the user requests a detailed solution.\n"
            "7. Verify calculations before providing the final answer.\n"
            "8. Do not force mathboard formatting into ordinary conversations that do not involve mathematics.\n"
            "9. If the user explicitly requests only a short answer, keep the mathematical working concise.\n"
        )

        # =====================================================
        # GET FRONTEND MESSAGES
        # =====================================================

        messages = getattr(discription, "messages", None)

        user_sys_prompt = getattr(discription, "sys_prompt", None)

        frontend_system_prompts = []

        if messages:
            frontend_system_prompts.extend(
                m.get("content", "")
                for m in messages
                if m.get("role") == "system" and m.get("content")
            )

        # Also support the separate sys_prompt field
        if user_sys_prompt:
            frontend_system_prompts.append(user_sys_prompt)

        # =====================================================
        # COMBINE BACKEND AND FRONTEND SYSTEM PROMPTS
        # =====================================================

        combined_sys_prompt = backend_sys_prompt

        if frontend_system_prompts:
            combined_sys_prompt += (
                "\n\n"
                "# USER-SPECIFIED INSTRUCTIONS\n" + "\n\n".join(frontend_system_prompts)
            )

        # =====================================================
        # PROVIDER SELECTION
        # =====================================================

        if provider == "groq":

            if owner and not discription.model.startswith(f"{owner}/"):
                full_model_name = f"{owner}/{discription.model}"
            else:
                full_model_name = discription.model

            # =================================================
            # FORMAT MESSAGES
            # =================================================

            formatted_messages = [{"role": "system", "content": combined_sys_prompt}]

            if messages is not None:

                # Preserve conversation history.
                # System messages are already combined above.
                formatted_messages.extend(
                    m for m in messages if m.get("role") != "system"
                )

            else:

                formatted_messages.append({"role": "user", "content": prompt})

            # =================================================
            # GROQ API REQUEST
            # =================================================

            response = sr_groq.send_prompt_with_history(
                client=cd_groq.client,
                model=full_model_name,
                temperature=temperature,
                messages=formatted_messages,
            )

            # =================================================
            # HANDLE RESPONSE
            # =================================================

            if response.get("succeed"):

                output = response.get("output")

                if isinstance(output, dict) and "choices" in output:
                    content = output["choices"][0]["message"]["content"]

                elif hasattr(output, "choices"):
                    content = output.choices[0].message.content

                else:
                    content = output

                return {"succeed": 1, "output": content}

            else:
                return {
                    "succeed": 0,
                    "error": response.get(
                        "error", "Something went wrong during Groq API invocation."
                    ),
                }

        else:

            return {
                "succeed": 0,
                "error": f"Unknown provider: {provider}. Choose Groq.",
            }

    except Exception as e:

        return {"succeed": 0, "error": str(e)}
