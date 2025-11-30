import { z } from 'zod';

export const ClubCategorySchema = z.enum([
  'PERFORMING_ARTS',
  'LIBERAL_ARTS_SERVICE',
  'EXHIBITION_ARTS',
  'RELIGION',
  'BALL_LEISURE',
  'PHYSICAL_MARTIAL_ARTS',
  'ACADEMIC',
]);

export const ClubTypeSchema = z.enum(['CENTRAL', 'DEPARTMENTAL']);

export const RecruitmentStatusSchema = z.enum(['RECRUITING', 'SCHEDULED', 'CLOSED']);

export const LoginReqSchema = z.object({
  googleGrantCode: z.string(),
});

export const RegisterUserReqSchema = z.object({
  googleGrantCode: z.string(),
  department: z.string(),
  studentId: z.string(),
  phoneNumber: z.string(),
});

export const ReissueAccessTokenReqSchema = z.object({
  refreshToken: z.string(),
});

export const AnswerCreateReqSchema = z.object({
  answer: z.string(),
});

export const QuestionCreateReqSchema = z.object({
  question: z.string(),
  userName: z.string(),
});

export const PostUrlReqSchema = z.object({
  postUrl: z.string(),
});

export const FeedCreatedReqSchema = z.object({
  content: z.string(),
  postUrls: z.array(PostUrlReqSchema),
});

export const PresignedUrlReqSchema = z.object({
  fileName: z.string(),
});

export const PresignedUrlListReqSchema = z.object({
  presignedUrlList: z.array(PresignedUrlReqSchema),
});

export const PageableSchema = z.object({
  page: z.number().int().min(0).optional(),
  size: z.number().int().min(1).optional(),
  sort: z.array(z.string()).optional(),
});

export const ClubListParamsSchema = z.object({
  category: ClubCategorySchema.optional(),
  type: ClubTypeSchema.optional(),
  recruitmentStatus: RecruitmentStatusSchema.optional(),
  targetGraduate: z.number().int().optional(),
  weeklyActiveFrequency: z.number().int().optional(),
  query: z.string().optional(),
  pageable: PageableSchema,
});

export type LoginReqInput = z.input<typeof LoginReqSchema>;
export type RegisterUserReqInput = z.input<typeof RegisterUserReqSchema>;
export type ReissueAccessTokenReqInput = z.input<typeof ReissueAccessTokenReqSchema>;
export type AnswerCreateReqInput = z.input<typeof AnswerCreateReqSchema>;
export type QuestionCreateReqInput = z.input<typeof QuestionCreateReqSchema>;
export type FeedCreatedReqInput = z.input<typeof FeedCreatedReqSchema>;
export type PresignedUrlListReqInput = z.input<typeof PresignedUrlListReqSchema>;
export type ClubListParamsInput = z.input<typeof ClubListParamsSchema>;
