CREATE TABLE "plagiarism_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"language" text NOT NULL,
	"code1" text NOT NULL,
	"code2" text NOT NULL,
	"similarity_percentage" integer NOT NULL,
	"structural_similarity" integer NOT NULL,
	"control_flow" integer NOT NULL,
	"logic_patterns" integer NOT NULL,
	"variable_renaming" boolean NOT NULL,
	"tokens_analyzed" integer NOT NULL,
	"matching_segments" integer NOT NULL,
	"matches" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
