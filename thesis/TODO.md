## 001 - PROJECT_PRACTICAL_DIR_INDEX Creation

1. Carefully read the following directories recursively to understand the structure of the codebase and where different types of information are located:

- `data`
- `firmware`
- `docs`
- `tools`
- `thesis\assets`

2. Once completed, create a new file called `PROJECT_PRACTICAL_DIR_INDEX.md` in the root of the project. This file should contain a structured index of the directories and files that are relevant for practical information extraction for the thesis. For each directory, provide a brief description of what type of information can be found there and how it relates to the different sections of the thesis. For example:

3. Create a new file called `PROJECT_PRACTICAL_DIR_INDEX.md` in the root of the project.

## 002 - THESIS_OUTLINE.md Enchancement

1. Read the `thesis\THESIS_OUTLINE.md` file and enhance it by adding explaining from where does the Agent need to extract the information. Some Section are completely theorical, thus they need web academic search. Some other are completely practical, here the Agent should find in the information from within the codebase (see `PROJECT_PRACTICAL_DIR_INDEX.md`). And some others are a mix of both, thus the Agent should extract information from both the codebase and the web. This needs to be reflected on each subsection of the `THESIS_OUTLINE.md` file. For example, for the `2.1 Literature Search Method (PRISMA-inspired rapid SLR) (~400 words)` section, the Agent should know that it needs to do an academic search on the web to find relevant papers and information about PRISMA-inspired rapid SLR methods. For the `7.7 Quantization Strategy (~300 words)` section, the Agent should know that it needs to extract information from the codebase about how quantization is implemented in the project, as well as do some web research on Float32 vs. Int8 quantization strategies. Be specific about which files or directories in the codebase are relevant for each practical or mixed section.

## 003 - Section Shell Creation

1. Read the `thesis\THESIS_OUTLINE.md`
2. Go and read `thesis\typst\chapters\01_introduction`.
3. Based on the 2 files you just read, go and create the sections for the rest of the chapters in the `thesis\typst\chapters` directory.

- **IMPORTANT NOTE 001**, some chapter have some section already created, so make sure to only create the missing sections. For example, in `01_introduction`, all sections are already created, so you can skip that chapter and move on to `02_literature_review` and create the missing sections there.

- **IMPORTANT NOTE 002**, you might find some inconsistencies between the `THESIS_OUTLINE.md` and the already created sections in `thesis\typst\chapters`. The SSOT (Single Source of Truth) for the structure of the thesis is the `THESIS_OUTLINE.md`, thus if you find any inconsistency, you should modify the already created sections to reflect the structure defined in `THESIS_OUTLINE.md`.
