import '../config/env.js'

import express from 'express'
import { wrapper } from '../utils/wrapper.js'
import { BoardService } from '../services/board.js'
import { body } from 'express-validator'
import { validate } from '../utils/validate.js'

export const boardRouter = express.Router()
const boardService = new BoardService()

boardRouter.get(
    '/', // 리스트조회
    wrapper(async (req, res) => {
        try {
            const allBoard = await boardService.findAllBoard() // 모든 게시글 반환 서비스 함수
            return res.render('board/list.ejs', allBoard)
            // return res.send(allBoard)
        } catch (err) {
            throw err
        }
    })
)

boardRouter.get(
    // 검색
    '/search',
    wrapper(async (req, res) => {
        try {
            const queryDto = {
                q: req.query.q,
                sort: req.query.sort,
            }
            const searchedResult = await boardService.searchList(queryDto)
            return res.render('board/list.ejs', searchedResult)
            // return res.send(searchedResult)
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/form ] 게시글 작성 */

boardRouter.get(
    // 게시글 작성 폼 조회
    '/form',
    wrapper(async (req, res) => {
        try {
            // console.log(req.userId)
            return res.render('board/form.ejs')
            // return res.send({message : '게시글 작성 폼 조회'})
        } catch (err) {
            throw err
        }
    })
)

boardRouter.post(
    // 작성한 게시글 저장
    '/form',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            // console.log(req.userId)
            const boardDto = {
                title: req.body.title,
                content: req.body.content,
                userid: req.userId,
            }

            const createdBoard = await boardService.createNewBoard(boardDto) // 작성된 글 저장 서비스 함수

            if (createdBoard.result === true) {
                return res.status(201).send(createdBoard)
            } else {
                return res.status(400).send(createdBoard)
            }
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/:boardId/edit ] 게시글 수정 */

boardRouter.get(
    // 수정 권한이 있다면 게시글 수정 페이지 조회
    '/:boardId/edit',
    wrapper(async (req, res) => {
        try {
            console.log(req.userId)

            const boardDto = { boardId: req.params.boardId.split(':')[1] }
            const original =
                await boardService.getOriginalBoardById(boardDto)

            const isValid = req.userId === original.data.board_user_id

            if (isValid) {
                return res.status(200).render('board/edit.ejs', original)
                // return res.status(200).send(original)
            } else {
                return res.status(401).send({ message: '권한없음' })
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.put(
    // 수정된 게시글 데이터 저장
    '/:boardId/edit',
    validate([body('title').notEmpty(), body('content').notEmpty()]),
    wrapper(async (req, res) => {
        try {
            const boardDto = {
                boardId: req.params.boardId.split(':')[1],
                title: req.body.title,
                content: req.body.content,
            }
            const updateResult = await boardService.updateBoardById(boardDto)

            if (updateResult.result === true) {
                return res.status(201).send(updateResult)
            } else {
                return res.status(404).send(updateResult)
            }
        } catch (err) {
            throw err
        }
    })
)

/* [ /board/:boardId ] 게시글 조회 */

boardRouter.get(
    // 게시글 아이디가 boardId인 게시글 조회
    '/:boardId',
    wrapper(async (req, res) => {
        try {
            const boardDto = { boardId: req.params.boardId.split(':')[1] }

            const board = await boardService.getBoardById(boardDto) // 게시글 아이디 boardId와 일치하는 글 갖고옴

            if (board.result === true) {
                return res.status(200).render('board', board) // 그 글 페이지의 데이터, 화면을 보여줘야함
                // return res.status(200).send(board)
            } else {
                return res.status(404).render('board', board)
            }
        } catch (err) {
            throw err
        }
    })
)

boardRouter.delete(
    // 게시글 아이디가 boardId인 게시글 삭제
    '/:boardId',
    wrapper(async (req, res) => {
        try {
            console.log(req.userId)

            const boardDto = {
                userId: req.userId,
                boardId: req.params.boardId.split(':')[1],
            }

            const isDeleted = await boardService.deleteBoardById(boardDto)

            if (isDeleted.result) {
                return res.status(200).send(isDeleted)
            } else {
                return res.status(400).send(isDeleted)
            } // 삭제 실패 시에는 res.status(401)하도록 수정해야함
        } catch (err) {
            throw err
        }
    })
)
