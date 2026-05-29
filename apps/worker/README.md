# `@opentax/worker`

Asynchronous processing runtime for document extraction and export flows.

## Form16 Extraction Runtime

The worker integrates with `@opentax/document-intelligence` and can run Form16 extraction when configured.

Required environment variables:
- `DOC_INPUT_FILE_PATH`
- `LLM_API_BASE_URL`
- `LLM_MODEL`
- `TESSERACT_OCR_ENDPOINT`
- `PADDLE_OCR_ENDPOINT`

Optional:
- `DOC_TYPE` (defaults to `FORM16`; supported: `FORM16`, `ITR_ACKNOWLEDGEMENT`)
- `LLM_API_KEY`
- `OCR_API_KEY`
